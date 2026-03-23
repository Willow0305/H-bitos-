import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import * as Location from 'expo-location';

export default function Home() {
  const [localNome, setLocalNome] = useState('');
  const [meusLocais, setMeusLocais] = useState<any[]>([]);

  const configurarLocalizacao = async () => {
    // Pede a permissão de Foreground (App aberto)
    let { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert("Atenção", "Precisamos de acesso ao GPS para o Habitos funcionar!");
      return;
    }

    // Pega a posição atual para salvar o local
    let localizacaoAtual = await Location.getCurrentPositionAsync({});
    
    const novoLocal = {
      id: Math.random().toString(),
      nome: localNome || "Local sem nome",
      latitude: localizacaoAtual.coords.latitude,
      longitude: localizacaoAtual.coords.longitude,
    };

    setMeusLocais([...meusLocais, novoLocal]);
    setLocalNome('');
    Alert.alert("Sucesso", `Local "${novoLocal.nome}" guardado com as tuas coordenadas atuais!`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📍 Habitos - Meus Locais</Text>
      
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          placeholder="Nome do lugar (ex: UFAC)"
          value={localNome}
          onChangeText={setLocalNome}
        />
        <TouchableOpacity style={styles.botao} onPress={configurarLocalizacao}>
          <Text style={styles.botaoTexto}>Salvar Local</Text>
        </TouchableOpacity>
      </View>

      <FlatList 
        data={meusLocais}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemLocal}>
            <Text style={styles.itemTexto}>{item.nome}</Text>
            <Text style={styles.itemSubtexto}>Lat: {item.latitude.toFixed(4)} | Lon: {item.longitude.toFixed(4)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6', padding: 40, paddingTop: 60 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2D3436' },
  inputContainer: { marginBottom: 30 },
  input: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#E1E1E1', marginBottom: 10 },
  botao: { backgroundColor: '#6C5CE7', padding: 15, borderRadius: 10, alignItems: 'center' },
  botaoTexto: { color: '#FFF', fontWeight: 'bold' },
  itemLocal: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  itemTexto: { fontSize: 18, fontWeight: '600', color: '#2D3436' },
  itemSubtexto: { fontSize: 12, color: '#636E72', marginTop: 5 }
});