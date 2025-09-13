import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import axios from "axios";

export default function App() {
  const [agendamento, setAgendamento] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newAnotation, setNewAnotation] = useState("");

  const API = "http://10.110.12.27:3000/agendamento";

  // Função para formatar data e hora
  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(" ")[0].slice(0, 5); // HH:MM
    return { date, time };
  };

  // Buscar agendamentos do json-server
  const fetchAgendamentos = async () => {
    try {
      const response = await axios.get(API);
      setAgendamento(response.data);
    } catch (error) {
      console.log("Error GET:", error.message);
    }
  };

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  // Função para criar agendamentos
  const addAgendamento = async () => {
    if (!newTitle.trim() || !newAnotation.trim()) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    const { date, time } = getCurrentDateTime();

    try {
      const response = await axios.post(API, {
        titulo: newTitle,
        anotacoes: newAnotation,
        data: date,
        hora: time,
        status: "pendente",
      });

      setAgendamento([...agendamento, response.data]);
      setNewTitle("");
      setNewAnotation("");
    } catch (error) {
      console.log("Error POST:", error.message);
    }
  };

  // Função para deletar agendamentos
  const deleteAgendamento = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setAgendamento(agendamento.filter(item => item.id !== id));
    } catch (error) {
      console.log("Error DELETE:", error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.titulo}</Text>
      <Text>{item.anotacoes}</Text>
      <Text>
        {item.data} {item.hora} - <Text style={styles.status}>{item.status}</Text>
      </Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteAgendamento(item.id)}>
        <Text style={styles.deleteText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agenda de Compromissos</Text>

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={newTitle}
        onChangeText={setNewTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Anotações"
        value={newAnotation}
        onChangeText={setNewAnotation}
      />

      <Button title="Adicionar Agendamento" onPress={addAgendamento} />

      <FlatList
        data={agendamento}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  status: {
    fontWeight: "bold",
    color: "orange",
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "red",
    padding: 8,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
});