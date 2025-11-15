import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window');

// Definicije boja za lakše održavanje
const RED_600 = '#DC2626'; // Približno RGB(220, 38, 38)
const GRAY_300 = '#D1D5DB';

// Glavna komponenta
const Post = ({post}) => {
  const [upvotes, setUpvotes] = useState(post.upvotes - post.downvotes);
  const [hasVotedUp, setHasVotedUp] = useState(false);
  const [hasVotedDown, setHasVotedDown] = useState(false);
  const [imageUri, setImageUri] = useState("");

  const handleVote = async (type) => {

    if(type === 'up') {
      setUpvotes(prev => hasVotedUp ? prev - 1 : prev + 1)
      setHasVotedUp(!hasVotedUp)
      setHasVotedDown(hasVotedUp)

      const url = `http://10.0.10.166:8080/api/problems/${post.id}/upvote`
      const token = await SecureStore.getItemAsync("user_jwt")
      const req = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(hasVotedUp)
            
        }

        const res = await fetch(url,req)
        if(!res.ok) {
            const error = await res.json()
            alert(error)
        }

        const data = await res.json()

    }else{
      setUpvotes(prev => hasVotedDown ? prev + 1 : prev - 1)
      setHasVotedDown(!hasVotedDown)

      const url = `http://10.0.10.166:8080/api/problems/${post.id}/downvote`
      const token = await SecureStore.getItemAsync("user_jwt")
      const req = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(hasVotedDown)
        }

        const res = await fetch(url,req)
        if(!res.ok) {
            const error = await res.json()
            alert(error)
        }

    }

  };

  const fetchImage = async () => {
      const url = `http://10.0.10.166:8080${post.imageUrl}`
      const token = await SecureStore.getItemAsync("user_jwt")
      const req = {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }

      const res = await fetch(url, req)
      if(!res.ok) {
        alert(res.status)
        console.error(res.status)
        return
      }
      setImageUri(url)
    }

  useEffect(() => {
    fetchImage()
  },[])

  return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.postContainer}>
                <View style={styles.titleSection}>
                    <Text style={styles.titleText}>
                        {post.description}
                    </Text>
                </View>

                <View style={styles.visualWrapper}>
                    <Image
                        source={{ uri: imageUri ? imageUri : 'https://via.placeholder.com/150' }} 
                        style={styles.mainImage}
                        resizeMode="cover" 
                    />
                </View>
                
                {/* --- 4. Footer Action Bar (Podnožje) --- */}
                <View style={styles.footer}>
                    {/* Vote Section */}
                    <View style={styles.voteSection}>
                      <Text>Urgent?</Text>
                        <TouchableOpacity 
                            onPress={() => handleVote('up')}
                            style={styles.voteButton}
                        >
                            <Text style={[styles.voteIcon, hasVotedUp && styles.voteIconActive]}>▲</Text>
                            <Text style={[styles.voteLabel, hasVotedUp && styles.voteLabelActive]}>{upvotes}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => handleVote('down')}
                            style={styles.downVoteArea}
                        >
                            <Text style={[styles.downVoteIcon, hasVotedDown && styles.downVoteIconActive]}>▼</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* Comments Section */}
                    <View style={styles.footerItem}>
                        <Text style={styles.footerIcon}>💬</Text>
                        <Text style={styles.footerLabel}>0</Text>
                    </View>

                    {/* Share Section */}
                    <View style={styles.footerItem}>
                        <Text style={styles.footerIcon}>⤿</Text>
                    </View>
                </View>
            </View>
        </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  postContainer: {
    width: width > 500 ? 500 : '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  titleSection: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  starIcon: {
    fontSize: 16,
    color: '#FBBF24', // Yellow 500
    marginLeft: 4,
  },
  visualWrapper: {
    // Mora biti View omotač da bi Image mogla imati padding i margin
    marginHorizontal: 12,
    borderRadius: 8, // Manje zaobljene ivice za vizuelni wrapper
    overflow: 'hidden',
    // Visina je bitna jer se Image komponenta mora sama dimenzionisati
    aspectRatio: 1, // Možete promeniti ovo da odgovara razmeri vaše slike
    width: width > 500 ? 500 - 24 : width - 24, // Puno širina post containera minus margin
  },
  mainImage: {
    flex: 1, // Ispuni ceo vizuelni omotač
    width: '100%',
    height: '100%',
  },
  
  // --- Novi Stilovi za Install sekciju ---
  installSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    marginTop: 8, // Mali razmak od slike
  },
  googlePlayText: {
    fontSize: 14,
    color: '#6B7280', // Siva boja
  },
  installButton: {
    backgroundColor: '#3B82F6', // Plava boja
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  installButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  // --- Footer Stilovi ---
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Izmenjeno da gura dugmad u krajeve
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    marginTop: 8,
  },
  voteSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  voteIcon: {
    fontSize: 12,
    color: GRAY_300, 
    marginRight: 4,
  },
  voteIconActive: {
    color: RED_600,
  },
  downVoteArea: {
    padding: 4,
    marginLeft: -8, // Približava dole strelicu glasovima
  },
  downVoteIcon: {
    fontSize: 12,
    color: GRAY_300,
  },
  downVoteIconActive: {
    color: RED_600,
  },
  voteLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  voteLabelActive: {
    color: RED_600,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  footerIcon: {
    fontSize: 18,
    marginRight: 4,
    color: '#6B7280',
  },
  footerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
});

export default Post;