
// ------------------

import { View,FlatList,ActivityIndicator } from "react-native";
import Post from "./Post";
import { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';  

function Posts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchPosts = async () => {
    setLoading(true)
    const url = "http://10.0.10.166:8080/api/problems"
    const token = await SecureStore.getItemAsync("user_jwt")
    const req = {
      method: "GET",
      headers: {
        "Authorization" : `Bearer ${token}`,
        "Content-Type" : "application/json"
      },
    }
    const res = await fetch(url, req)
    if(!res.ok) {
      alert(res.status)
      console.error(res.status)
      return
    }

    const data = await res.json()
    setPosts(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
  },[])

  const handleReport = (postId) => {
    Alert.alert("Report Sent", `You reported issue ID: ${postId}. Thank you.`);
  };

  const renderItem = ({ item }) => (
    <Post
      post={item} 
      onReportPress={handleReport} 
    />
  );

  if(loading) {
    return (
      <View style={{flex: 1, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingVertical: 10 }} 
      />
    </View>
  );
}

export default Posts