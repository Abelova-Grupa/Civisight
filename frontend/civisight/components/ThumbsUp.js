import { StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useState } from "react";

function ThumbsUp(postID) {
    const [clicked, setClicked] = useState(false)

    const handleThumbPress = async (postID) => {
        const jwt = await SecureStore.getItemAsync("user_jwt");
        if(!jwt) {
            alert("Non defined token - thumbs up")
            return;
        } 
        const url = `http://localhost:8080/api/problem/${postID}/upvote`
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
                name={clicked ? "thumbs-up" : "thumbs-up-outline"} 
                size={20} 
                color={clicked ? "#28a745" : "#666"} // Green when selected
            />
        </TouchableOpacity>
    )
}

export default ThumbsUp

const styles = StyleSheet.create({
    thumbButton: {
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: 'transparent'
  },    
})