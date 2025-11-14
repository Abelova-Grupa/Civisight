const DATA = [
  {
    id: '1',
    description: 'A large pothole has opened up in the middle of the street near City Hall, causing traffic jams.',
    imageUrl: 'https://picsum.photos/id/237/400/200',
    isUrgent: true,
  },
  {
    id: '2',
    description: 'Street light broken at the park entrance, needs replacement.',
    imageUrl: 'https://picsum.photos/id/1018/400/200',
    isUrgent: false,
  },
  {
    id: '3',
    description: 'Illegal dumping of construction debris on the corner lot.',
    imageUrl: 'https://picsum.photos/id/1025/400/200',
    isUrgent: true,
  },
];
// ------------------

import { View,FlatList } from "react-native";
import Post from "./Post";

function Posts() {
  const handleReport = (postId) => {
    // In a real app, this would navigate to the Report form or open a modal
    Alert.alert("Report Sent", `You reported issue ID: ${postId}. Thank you.`);
  };

  const renderItem = ({ item }) => (
    <Post
      post={item} 
      onReportPress={handleReport} 
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingVertical: 10 }} 
      />
    </View>
  );
}

export default Posts