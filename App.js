import React, { useState, useEffect } from "react"; // Importa React e hooks useState e useEffect
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native"; 
// Importa componentes básicos do React Native
import axios from "axios"; // Biblioteca para fazer requisições HTTP

export default function App() {
  // Estado para armazenar a lista de agendamentos
  const [agendamento, setAgendamento] = useState([]);
  
  // Estados para armazenar os valores dos inputs do usuário
  const [newTitle, setNewTitle] = useState("");
  const [newAnotation, setNewAnotation] = useState("");

  // URL da API json-server
  const API = "http://10.110.12.27:3000/agendamento";

  // Função para obter data e hora atuais formatadas
  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    const time = now.toTimeString().split(" ")[0].slice(0, 5); // Formato HH:MM
    return { date, time };
  };

  // Função para buscar agendamentos existentes do json-server
  const fetchAgendamentos = async () => {
    try {
      const response = await axios.get(API); // Requisição GET para a API
      setAgendamento(response.data); // Atualiza o estado com os dados recebidos
    } catch (error) {
      console.log("Error GET:", error.message); // Log de erro
    }
  };

  // useEffect para carregar os agendamentos ao iniciar o app
  useEffect(() => {
    fetchAgendamentos();
  }, []);

  // Função para criar um novo agendamento
  const addAgendamento = async () => {
    // Validação: campos obrigatórios
    if (!newTitle.trim() || !newAnotation.trim()) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    // Obtém a data e hora atuais
    const { date, time } = getCurrentDateTime();

    try {
      // Requisição POST para adicionar agendamento
      const response = await axios.post(API, {
        titulo: newTitle,
        anotacoes: newAnotation,
        data: date,
        hora: time,
        status: "pendente", // Status definido automaticamente
      });

      // Atualiza a lista local de agendamentos
      setAgendamento([...agendamento, response.data]);
      
      // Limpa os campos de input
      setNewTitle("");
      setNewAnotation("");
    } catch (error) {
      console.log("Error POST:", error.message); // Log de erro
    }
  };

  // Função para deletar um agendamento
  const deleteAgendamento = async (id) => {
    try {
      await axios.delete(`${API}/${id}`); // Requisição DELETE para o json-server
      setAgendamento(agendamento.filter(item => item.id !== id)); // Remove do estado local
    } catch (error) {
      console.log("Error DELETE:", error.message);
    }
  };

  // Função para renderizar cada item da lista como um card
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.titulo}</Text> {/* Título do agendamento */}
      <Text>{item.anotacoes}</Text> {/* Anotações */}
      <Text>
        {item.data} {item.hora} - <Text style={styles.status}>{item.status}</Text>
      </Text> {/* Data, hora e status */}
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteAgendamento(item.id)}>
        <Text style={styles.deleteText}>Excluir</Text> {/* Botão de exclusão */}
      </TouchableOpacity>
    </View>
  );

  // JSX principal da aplicação
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agenda de Compromissos</Text>

      {/* Input para título */}
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={newTitle}
        onChangeText={setNewTitle}
      />

      {/* Input para anotações */}
      <TextInput
        style={styles.input}
        placeholder="Anotações"
        value={newAnotation}
        onChangeText={setNewAnotation}
      />

      {/* Botão para adicionar agendamento */}
      <Button title="Adicionar Agendamento" onPress={addAgendamento} />

      {/* Lista de agendamentos */}
      <FlatList
        data={agendamento} // Dados da lista
        keyExtractor={(item) => item.id.toString()} // Chave única
        renderItem={renderItem} // Renderiza cada item
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  );
}

// Estilos da aplicação
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
    elevation: 2, // Sombra no Android
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