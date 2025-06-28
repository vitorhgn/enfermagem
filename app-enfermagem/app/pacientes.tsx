import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { useLocalSearchParams, useRouter } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

type Paciente = {
  IDPACIENTE: number;
  RGPACIENTE: string;
  ESTDORGPAC: string;
  STATUSANM: "Pendente" | "Aprovado" | "Reprovado";
  NOMEPESSOA: string;
  TEM_ANAMNESE?: boolean;
  IDANAMNESE?: number | null;
};

export default function ListaPacientesScreen() {
  const { userType } = useLocalSearchParams<{ userType: string }>();
  const router = useRouter();

  const tipoUsuario = Number(userType); // converte para número

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [carregando, setCarregando] = useState(true);

  const buscarPacientes = async () => {
    try {
      const { data } = await axios.get("http://160.20.22.99:5380/pacientes", {
        params: { userType: tipoUsuario },
      });
      setPacientes(data);
    } catch {
      Alert.alert("Erro", "Falha ao buscar pacientes.");
    } finally {
      setCarregando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      buscarPacientes();
    }, [])
  );

  function getStatusColor(status: string) {
    switch (status) {
      case "Aprovado":
        return "#005F3C";
      case "Reprovado":
        return "#FF8C42";
      default:
        return "#999";
    }
  }

  const handlePress = (paciente: Paciente) => {
    const isNovaAnamnese =
      !paciente.TEM_ANAMNESE && paciente.STATUSANM === "Pendente";

    const anamneseId = isNovaAnamnese ? "novo" : String(paciente.IDANAMNESE);

    router.push({
      pathname: "/anamnese/[id]",
      params: {
        id: anamneseId,
        pacienteId: paciente.IDPACIENTE,
        userType: String(tipoUsuario),
        profissionalId: 1, // substituir por valor real depois
        status: paciente.STATUSANM,
      },
    });
  };

  function nomeUsuario(tipo: number) {
    switch (tipo) {
      case 1:
        return "Estagiário";
      case 3:
        return "Supervisor";
      case 4:
        return "Coordenador";
      default:
        return "Desconhecido";
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
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Lista de Pacientes</Text>
      <Text style={styles.subTitle}>Usuário: {nomeUsuario(tipoUsuario)}</Text>

      <View style={styles.tableWrapper}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { flex: 0.5 }]}>#</Text>
          <Text style={[styles.headerCell, { flex: 2 }]}>NOME</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>UF</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>STATUS</Text>
        </View>

        <FlatList
          data={pacientes}
          keyExtractor={(item) => String(item.IDPACIENTE)}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)}>
              <View style={styles.tableRow}>
                <Text style={[styles.cell, { flex: 0.5 }]}>
                  {item.IDPACIENTE}
                </Text>
                <Text style={[styles.cell, { flex: 2 }]}>
                  {item.NOMEPESSOA}
                </Text>
                <Text style={[styles.cell, { flex: 1 }]}>
                  {item.ESTDORGPAC}
                </Text>
                <Text
                  style={[
                    styles.cell,
                    { flex: 1, color: getStatusColor(item.STATUSANM) },
                  ]}
                >
                  {item.STATUSANM}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E7FCEB",
    padding: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#005F3C",
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
  },
  tableWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#C5F1D0",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  headerCell: {
    fontWeight: "600",
    color: "#005F3C",
    fontSize: 14,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  cell: {
    fontSize: 14,
    color: "#222",
  },
});
