import { useLocalSearchParams, useRouter } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const pacientes = [
  { id: "1", nome: "Albert Flores", cpf: "123.456.789-10", status: "Aprovado" },
  { id: "2", nome: "Albert Flores", cpf: "123.456.789-10", status: "Pendente" },
  {
    id: "3",
    nome: "Albert Flores",
    cpf: "123.456.789-10",
    status: "Reprovado",
  },
];

const getStatusColor = (status: string) => {
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
  const { userType } = useLocalSearchParams();
  const router = useRouter();

  const handlePress = (paciente: any) => {
    router.push({
      pathname: "/anamnese/[id]",
      params: {
        id: paciente.id,
        userType: userType as string,
        status: paciente.status,
      },
    });
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
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)}>
              <View style={styles.tableRow}>
                <Text style={[styles.cell, { flex: 0.5 }]} numberOfLines={1}>
                  {item.id}
                </Text>
                <Text style={[styles.cell, { flex: 2.5 }]} numberOfLines={1}>
                  {item.nome}
                </Text>
                <Text style={[styles.cell, { flex: 2.5 }]} numberOfLines={1}>
                  {item.cpf}
                </Text>
                <View style={[styles.badgeContainer, { flex: 2 }]}>
                  <Text
                    style={[
                      styles.badge,
                      { backgroundColor: getStatusColor(item.status) },
                    ]}
                    numberOfLines={1}
                  >
                    {item.status}
                  </Text>
                </View>
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
