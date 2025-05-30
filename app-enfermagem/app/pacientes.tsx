import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

type AnamneseStatus = "Aprovado" | "Pendente" | "Reprovado";

type Paciente = {
  id: string;
  nome: string;
  cpf: string;
  anamnese: {
    id: string;
    status: AnamneseStatus;
  } | null;
};

const mockPacientes: Paciente[] = [
  {
    id: "1",
    nome: "João Silva",
    cpf: "111.222.333-44",
    anamnese: { id: "101", status: "Aprovado" },
  },
  {
    id: "2",
    nome: "Maria Souza",
    cpf: "555.666.777-88",
    anamnese: null,
  },
  {
    id: "3",
    nome: "Carlos Lima",
    cpf: "999.000.111-22",
    anamnese: { id: "103", status: "Reprovado" },
  },
];

const getStatusColor = (status: AnamneseStatus) => {
  switch (status) {
    case "Aprovado":
      return "#1DB954";
    case "Pendente":
      return "#FFD700";
    case "Reprovado":
      return "#FF4C4C";
    default:
      return "#aaa";
  }
};

export default function ListaPacientesScreen() {
  const { userType } = useLocalSearchParams<{ userType: string }>();
  const router = useRouter();
  const [pacientes, setPacientes] = useState<Paciente[]>(mockPacientes);

  const handlePress = (paciente: Paciente) => {
    const user = String(userType).toLowerCase();

    if (!paciente.anamnese) {
      if (user === "estagiario") {
        router.push({
          pathname: "/anamnese/[id]",
          params: {
            id: "novo",
            pacienteId: paciente.id,
            userType: user,
          },
        });
      } else {
        Alert.alert("Sem Anamnese", "Este paciente ainda não possui anamnese.");
      }
    } else {
      router.push({
        pathname: "/anamnese/[id]",
        params: {
          id: paciente.anamnese.id,
          userType: user,
          status: paciente.anamnese.status,
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Lista de Pacientes</Text>
      <Text style={styles.subTitle}>Usuário: {userType}</Text>

      <View style={styles.tableWrapper}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { flex: 0.5 }]}>#</Text>
          <Text style={[styles.headerCell, { flex: 2 }]}>Nome</Text>
          <Text style={[styles.headerCell, { flex: 1.5 }]}>CPF</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>Status</Text>
        </View>

        <FlatList
          data={pacientes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const status = item.anamnese?.status ?? "Pendente";
            return (
              <TouchableOpacity onPress={() => handlePress(item)}>
                <View style={styles.tableRow}>
                  <Text style={[styles.cell, { flex: 0.5 }]}>{item.id}</Text>
                  <Text style={[styles.cell, { flex: 2 }]}>{item.nome}</Text>
                  <Text style={[styles.cell, { flex: 1.5 }]}>{item.cpf}</Text>
                  <View style={[styles.badgeContainer, { flex: 1 }]}>
                    <Text
                      style={[
                        styles.badge,
                        { backgroundColor: getStatusColor(status) },
                      ]}
                    >
                      {status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
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
  badgeContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  badge: {
    color: "#fff",
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
});
