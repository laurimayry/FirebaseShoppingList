import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';
import { StyleSheet, FlatList, TextInput, View, Button, Text } from 'react-native';
import { useState, useEffect} from 'react';




const firebaseConfig = {
    apiKey: "AIzaSyCF3JbRVtue5gH9cEQ3aVi1uh_8HQyHilg",
    authDomain: "shoppinglist-dff54.firebaseapp.com",
    databaseURL: "https://shoppinglist-dff54-default-rtdb.firebaseio.com",
    projectId: "shoppinglist-dff54",
    storageBucket: "shoppinglist-dff54.appspot.com",
    messagingSenderId: "394385170709",
    appId: "1:394385170709:web:6adf8144a3f16698d7891c",
    measurementId: "G-R66S6NQFG6"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  export default function App(){


    const [product, setProduct] = useState('')
    const [amount, setAmount] = useState('')
    const [items, setItems] = useState([]);



    useEffect(() => {
        const itemsRef = ref(database, 'items/');
        onValue(itemsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const itemsArray = Object.entries(data).map(([key, value]) => ({ key, ...value }));
            setItems(itemsArray);
          } else {
            setItems([]);
          }
        });
      }, []);

        const saveItem = () => {
            push(ref(database, 'items/'), {product, amount});
        }

        
        const removeItem = (key) => {
            remove(ref(database, `items/${key}`))
              .then(() => {
                console.log("Item removed successfully!",key);
              })
              .catch((error) => {
                console.error("Error removing item:", error);
              });
          };

    return (
    
     <View style={styles.container}>
        <TextInput
            placeholder='Title'
            onChangeText={product => setProduct(product)}
            value={product}>
        </TextInput>

        <TextInput
            placeholder='Amount'
            onChangeText={amount => setAmount(amount)}
            value={amount}>
        </TextInput>

        <Button onPress={saveItem} title="Save" />
        <Text style={{marginTop: 30, marginBottom: 10, fontSize: 20, fontWeight:'bold'}}>Shopping list</Text>
        <FlatList
            data={items}
            renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>{`${item.product}, ${item.amount}`}</Text>
                <Button onPress={() => removeItem(item.key)} title="Remove" />
            </View>
        )}
      />
    </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
     flex: 1,
     backgroundColor: '#fff',
     alignItems: 'center',
     justifyContent: 'center',
     marginTop: 100
    }
   });