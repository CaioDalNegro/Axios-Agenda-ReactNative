import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import axios from "axios";

export default function App() {
  const [agendamento, setAgendamento] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newAnotation, setNewAnotation] = useState("");

  const API = "http://10.110.12.27:3000/agendamento";

  // Função para formatar data e hora
  const getCurrentDateTime = () => {
    const now = new Date();
    
    // Formato da data: YYYY-MM-DD
    const date = now.toISOString().split("T")[0];
    
    // Formato da hora: HH:MM
    const time = now.toTimeString().split(" ")[0].slice(0, 5);
    
    return { date, time };
  };

  const addAgendamento = async () => {
    const { date, time } = getCurrentDateTime();

    try {
      const response = await axios.post(API, {
        titulo: newTitle,
        anotacoes: newAnotation,
        data: date,
        hora: time,
        status: "pendente" // status padrão
      });

      setAgendamento([...agendamento, response.data]);
      setNewTitle("");
      setNewAnotation("");
    } catch (error) {
      console.log("Error POST:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agenda de Compromissos - Adicionar agendamento</Text>

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
        renderItem={({ item }) => (
          <Text>
            {item.titulo} - {item.anotacoes} - {item.data} - {item.hora} - {item.status}
          </Text>
        )}
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
  },
});