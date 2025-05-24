import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AnamneseScreen() {
  const { userType, status } = useLocalSearchParams();
  const isEstagiario = userType === "estagiario";
  const isSupervisor = userType === "supervisor";
  const isCoordenador = userType === "coordenador";
  const isReprovadaOuPendente = status === "Reprovado" || status === "Pendente";

  const [cpf, setCpf] = useState("123.456.789-10");
  const [sexo, setSexo] = useState("Masculino");
  const [rg, setRg] = useState("1234567");
  const [leito, setLeito] = useState("Leito 2");
  const [escolaridade, setEscolaridade] = useState("Superior");
  const [profissao, setProfissao] = useState("Enfermeiro");
  const [diagnostico, setDiagnostico] = useState("Hipertensão");
  const [observacao, setObservacao] = useState("");

  const isEditable = (isEstagiario && isReprovadaOuPendente) || isEstagiario;

  const handleSalvar = () => {
    Alert.alert("Anamnese salva!");
  };

  const handleReprovar = () => {
    if (!observacao.trim()) {
      return Alert.alert("Erro", "Observação é obrigatória ao reprovar.");
    }
    Alert.alert("Anamnese reprovada!");
  };

  const handleAprovar = () => {
    Alert.alert("Anamnese aprovada!");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ficha de Anamnese</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={cpf}
          onChangeText={setCpf}
          editable={isEditable}
        />
        <TextInput
          style={styles.input}
          placeholder="Sexo"
          value={sexo}
          onChangeText={setSexo}
          editable={isEditable}
        />
        <TextInput
          style={styles.input}
          placeholder="RG"
          value={rg}
          onChangeText={setRg}
          editable={isEditable}
        />
        <TextInput
          style={styles.input}
          placeholder="Leito"
          value={leito}
          onChangeText={setLeito}
          editable={isEditable}
        />
        <TextInput
          style={styles.input}
          placeholder="Escolaridade"
          value={escolaridade}
          onChangeText={setEscolaridade}
          editable={isEditable}
        />
        <TextInput
          style={styles.input}
          placeholder="Profissão"
          value={profissao}
          onChangeText={setProfissao}
          editable={isEditable}
        />
        <TextInput
          style={styles.input}
          placeholder="Diagnóstico Médico"
          value={diagnostico}
          onChangeText={setDiagnostico}
          editable={isEditable}
        />

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
              Obrigatório preencher ao reprovar o paciente.
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
  input: {
    backgroundColor: "#F7F7F7",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
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
});
