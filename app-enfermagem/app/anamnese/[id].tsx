import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

type Resposta = {
  ID_PERGUNTA: number;
  PERGUNTA?: string;
  TIPO?: "S" | "O" | "A";
  RESPSUBJET?: string;
  RESPOBJET?: boolean | string | number;
};

export default function AnamneseScreen() {
  const { userType, status, id, pacienteId, profissionalId } =
    useLocalSearchParams();

  const router = useRouter();
  const userTypeNumber = Number(userType);

  const isEstagiario = userTypeNumber === 1;
  const isSupervisor = userTypeNumber === 3;
  const isNova = id === "novo";
  const isEditable = isEstagiario && (isNova || status === "Reprovado");

  const [carregando, setCarregando] = useState(true);
  const [observacao, setObservacao] = useState("");
  const [respostas, setRespostas] = useState<Resposta[]>([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        if (isNova) {
          const { data: perguntas } = await axios.get(
            "http://160.20.22.99:5380/perguntas"
          );
          const respostasIniciais = perguntas.map((p: any) => ({
            ID_PERGUNTA: p.IDPERGUNTA,
            PERGUNTA: p.PERGUNTA,
            TIPO: p.TIPO,
            RESPSUBJET: "",
            RESPOBJET: false,
          }));
          setRespostas(respostasIniciais);
        } else {
          const { data } = await axios.get(
            `http://160.20.22.99:5380/anamnese/paciente/${pacienteId}`
          );
          setRespostas(data.respostas || []);
          setObservacao(data.OBSERVACOES || "");
        }
      } catch (error) {
        console.error("Erro:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  async function handleSalvar() {
    try {
      if (id === "novo") {
        await axios.post("http://160.20.22.99:5380/anamnese", {
          ID_PACIENTE: Number(pacienteId),
          ID_PROFISSIO: Number(profissionalId),
          NOMERESP: "Responsável Fictício",
          CPFRESP: "12345678901",
          AUTVISIB: true,
          STATUSANM: "CANCELADO",
          STATUSFUNC: 1,
          OBSERVACOES: "",
          respostas: respostas.map((r) => ({
            ID_PERGUNTA: r.ID_PERGUNTA,
            RESPSUBJET: r.RESPSUBJET,
            RESPOBJET: r.RESPOBJET,
          })),
        });
      } else {
        await axios.put(`http://160.20.22.99:5380/anamnese/${id}`, {
          respostas: respostas.map((r) => ({
            ID_PERGUNTA: r.ID_PERGUNTA,
            RESPSUBJET: r.RESPSUBJET,
            RESPOBJET: r.RESPOBJET,
          })),
        });
      }

      Alert.alert("Sucesso", "Anamnese salva com sucesso.", [
        {
          text: "OK",
          onPress: () => {
            router.replace({
              pathname: "/pacientes",
              params: { userType: String(userTypeNumber) },
            });
          },
        },
      ]);
    } catch (err) {
      console.error("Erro ao salvar anamnese:", err);
      Alert.alert("Erro", "Não foi possível salvar.");
    }
  }

  async function handleAprovar() {
    try {
      await axios.post(`http://160.20.22.99:5380/anamnese/${id}/aprovar`);
      Alert.alert("Sucesso", "Anamnese aprovada com sucesso.", [
        {
          text: "OK",
          onPress: () => {
            router.replace({
              pathname: "/pacientes",
              params: { userType: String(userTypeNumber) },
            });
          },
        },
      ]);
    } catch {
      Alert.alert("Erro", "Erro ao aprovar.");
    }
  }

  async function handleReprovar() {
    if (!observacao.trim()) {
      return Alert.alert("Erro", "Observação obrigatória para reprovar.");
    }
    try {
      await axios.post(`http://160.20.22.99:5380/anamnese/${id}/reprovar`, {
        observacoes: observacao,
      });
      Alert.alert("Sucesso", "Anamnese reprovada com sucesso.", [
        {
          text: "OK",
          onPress: () => {
            router.replace({
              pathname: "/pacientes",
              params: { userType: String(userTypeNumber) },
            });
          },
        },
      ]);
    } catch {
      Alert.alert("Erro", "Erro ao reprovar.");
    }
  }

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#005F3C" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ficha de Anamnese</Text>

      <View style={styles.form}>
        {respostas.map((res, index) => (
          <View key={res.ID_PERGUNTA} style={{ marginBottom: 16 }}>
            <Text style={styles.label}>{res.PERGUNTA}</Text>

            {res.TIPO === "S" && (
              <TextInput
                style={styles.input}
                placeholder="Digite a resposta"
                placeholderTextColor="#999"
                value={res.RESPSUBJET}
                onChangeText={(text) => {
                  const novas = [...respostas];
                  novas[index].RESPSUBJET = text;
                  setRespostas(novas);
                }}
                editable={isEditable}
              />
            )}

            {res.TIPO === "A" && (
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descreva com detalhes..."
                placeholderTextColor="#999"
                multiline
                value={res.RESPSUBJET}
                onChangeText={(text) => {
                  const novas = [...respostas];
                  novas[index].RESPSUBJET = text;
                  setRespostas(novas);
                }}
                editable={isEditable}
              />
            )}

            {res.TIPO === "O" && (
              <View style={styles.radioOpcoes}>
                <TouchableOpacity
                  style={[
                    styles.radioBotao,
                    res.RESPOBJET === 1 && styles.radioSelecionado,
                  ]}
                  onPress={() => {
                    if (!isEditable) return;
                    const novas = [...respostas];
                    novas[index].RESPOBJET = 1;
                    setRespostas(novas);
                  }}
                >
                  <Text style={styles.radioTexto}>Sim</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.radioBotao,
                    res.RESPOBJET === 0 && styles.radioSelecionado,
                  ]}
                  onPress={() => {
                    if (!isEditable) return;
                    const novas = [...respostas];
                    novas[index].RESPOBJET = 0;
                    setRespostas(novas);
                  }}
                >
                  <Text style={styles.radioTexto}>Não</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {isSupervisor && !isNova && (
          <>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Digite observações"
              multiline
              value={observacao}
              onChangeText={setObservacao}
            />
            <Text style={styles.obrigatorio}>
              Obrigatório preencher ao reprovar.
            </Text>
          </>
        )}

        {isEstagiario && (
          <TouchableOpacity style={styles.salvar} onPress={handleSalvar}>
            <Text style={styles.buttonText}>SALVAR</Text>
          </TouchableOpacity>
        )}

        {isSupervisor && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.reprovar} onPress={handleReprovar}>
              <Text style={styles.buttonText}>REPROVAR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.aprovar} onPress={handleAprovar}>
              <Text style={styles.buttonText}>APROVAR</Text>
            </TouchableOpacity>
          </View>
        )}

        {isEstagiario && !isNova && status === "Reprovado" && observacao && (
          <Text style={styles.observacao}>
            OBSERVAÇÃO DO SUPERVISOR: {observacao}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E7FCEB",
    padding: 16,
  },
  title: {
    fontSize: 22,
    marginBottom: 12,
    color: "#005F3C",
    fontWeight: "bold",
    textAlign: "center",
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    marginBottom: 6,
    color: "#005F3C",
    fontWeight: "bold",
    fontSize: 14,
  },
  input: {
    backgroundColor: "#F7F7F7",
    padding: 12,
    borderRadius: 10,
    fontSize: 14,
    color: "#000",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  salvar: {
    backgroundColor: "#005F3C",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  aprovar: {
    backgroundColor: "#005F3C",
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 8,
  },
  reprovar: {
    backgroundColor: "#FF8C42",
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
  },
  actions: {
    flexDirection: "row",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  obrigatorio: {
    color: "#800000",
    marginBottom: 8,
    fontSize: 12,
    fontStyle: "italic",
  },
  observacao: {
    backgroundColor: "#FFF7F7",
    color: "#800000",
    padding: 12,
    marginTop: 20,
    borderRadius: 10,
    fontStyle: "italic",
    fontSize: 13,
    lineHeight: 18,
  },
  radioOpcoes: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  radioBotao: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
  },
  radioSelecionado: {
    backgroundColor: "#007BFF",
    borderColor: "#007BFF",
  },
  radioTexto: {
    color: "#000",
  },
});
