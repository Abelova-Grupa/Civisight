import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import ThumbsDown from './ThumbsDown'
import ThumbsUp from './ThumbsUp'

const Post = ({ post, onReportPress }) => {
  
  return (
    <View style={styles.card}>
      <Image 
        source={{ uri: post.imageUrl }} 
        style={styles.image} 
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.description} numberOfLines={2}>
          {post.description}
        </Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Urgent?</Text>
            <View style={styles.urgentContainer}>
              <ThumbsUp postID={1}/>
              <ThumbsDown postID={1}/>
            </View>
            <View style={styles.footer}>
              <TouchableOpacity 
                style={styles.reportButton}
                onPress={() => onReportPress(post.id)}
              >
                <Text style={styles.buttonText}>Report Problem</Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200, // Fixed height for visual consistency
  },
  content: {
    padding: 15,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
  },
  urgentContainer: {
    flexDirection: 'row'
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  reportButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Post