import { StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useState } from "react";

function ThumbsDown(postID) {
    const [clicked, setClicked] = useState(false)

    const handleThumbPress = async (postID) => {
            const jwt = await SecureStore.getItemAsync("user_jwt");
            if(!jwt) {
                alert("Non defined token - thumbs up")
                return;
            } 
            const url = `http://localhost:8080/api/problem/${postID}/downvote`
            const req = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                },
                body: {
                    'vote': clicked
                }
            }
    
            const res = await fetch(url,req)
            if(!res.ok) {
                const error = await res.json()
                alert(error)
            }
    
            const data = await res.json()
            if(data) setClicked(!clicked)
        }

    return (
        <TouchableOpacity 
          style={styles.thumbButton} 
          onPress={() => handleThumbPress(postID)}
        >
          <Ionicons 
            name={clicked ? "thumbs-down" : "thumbs-down-outline"} 
            size={20} 
            color={clicked ? "#dc3545" : "#666"} // Red when selected
          />
        </TouchableOpacity>
    )
}

export default ThumbsDown

const styles = StyleSheet.create({
    thumbButton: {
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: 'transparent'
  },    
})