import { useLocalSearchParams } from "expo-router";
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
  RESPOBJET?: boolean | string;
};

export default function AnamneseScreen() {
  const { userType, status, id, pacienteId, profissionalId } =
    useLocalSearchParams();
  const isEstagiario = userType === "estagiario";
  const isSupervisor = userType === "supervisor";
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
            "http://192.168.15.8:3000/perguntas"
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
            `http://192.168.15.8:3000/anamnese/${id}`
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
      await axios.post("http://192.168.15.8:3000/anamnese", {
        ID_PACIENTE: Number(pacienteId),
        ID_PROFISSIO: Number(profissionalId),
        NOMERESP: "Responsável Fictício",
        CPFRESP: "12345678901",
        AUTVISIB: true,
        STATUSANM: "PENDENTE",
        STATUSFUNC: 1,
        OBSERVACOES: "",
        respostas: respostas.map((r) => ({
          ID_PERGUNTA: r.ID_PERGUNTA,
          RESPSUBJET: r.RESPSUBJET,
          RESPOBJET: r.RESPOBJET,
        })),
      });
      Alert.alert("Sucesso", "Anamnese salva com sucesso.");
    } catch (err) {
      Alert.alert("Erro", "Não foi possível salvar.");
    }
  }

  async function handleAprovar() {
    try {
      await axios.post(`http://192.168.15.8:3000/anamnese/${id}/aprovar`);
      Alert.alert("Sucesso", "Anamnese aprovada.");
    } catch {
      Alert.alert("Erro", "Erro ao aprovar.");
    }
  }

  async function handleReprovar() {
    if (!observacao.trim()) {
      return Alert.alert("Erro", "Observação obrigatória para reprovar.");
    }
    try {
      await axios.post(`http://192.168.15.8:3000/anamnese/${id}/reprovar`, {
        observacoes: observacao,
      });
      Alert.alert("Sucesso", "Anamnese reprovada.");
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
              <TouchableOpacity
                style={styles.select}
                onPress={() => {
                  if (!isEditable) return;
                  Alert.prompt("Resposta", res.PERGUNTA || "", [
                    {
                      text: "Cancelar",
                      style: "cancel",
                    },
                    {
                      text: "Salvar",
                      onPress: (value) => {
                        const novas = [...respostas];
                        novas[index].RESPOBJET = value;
                        setRespostas(novas);
                      },
                    },
                  ]);
                }}
              >
                <Text style={{ color: res.RESPOBJET ? "#000" : "#999" }}>
                  {res.RESPOBJET || "Selecione uma resposta"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {isSupervisor && (
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

        {isEstagiario && status === "Reprovado" && observacao && (
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
  select: {
    backgroundColor: "#F7F7F7",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
    height: 48,
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
});
