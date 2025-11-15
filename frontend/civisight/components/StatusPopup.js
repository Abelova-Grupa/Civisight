import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, TouchableOpacity } from 'react-native';

// Dohvaćanje visine prozora
const { height } = Dimensions.get('window');

/**
 * Prikazuje malu popup (toast) notifikaciju na VRHU zaslona.
 *
 * @param {number} statusCode - HTTP status kod.
 * @param {boolean} isVisible - Kontrolira je li popup vidljiv.
 * @param {function} onClose - Funkcija koja se poziva za zatvaranje popup-a.
 */
const StatusPopup = ({ statusCode, isVisible, onClose }) => {
  // Stanje za animaciju (pomicanje popup-a)
  const [slideAnim] = useState(new Animated.Value(0));

  // Određuje detalje poruke i stila na temelju status koda
  const getStatusDetails = (code) => {
    switch (code) {
      case 201:
        return {
          message: 'Successfully registered problem with AI.',
          backgroundColor: '#4CAF50', // Zelena za uspjeh
        };
      case 406:
        return {
          message: 'AI thinks that this is not a problem.',
          backgroundColor: '#FF9800', // Narančasta/Upozorenje
        };
      default:
        return {
          message: `Greška (${code}). Pokušajte ponovo.`,
          backgroundColor: '#F44336', // Crvena za greške
        };
    }
  };

  const { message, backgroundColor } = getStatusDetails(statusCode);
  
  // Funkcija za pokretanje animacije zatvaranja
  const handleClose = () => {
    // Pokreće animaciju klizanja prema gore (izvan ekrana)
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      onClose(); // Resetiranje stanja roditeljske komponente
    });
  };

  useEffect(() => {
    let timer;
    if (isVisible) {
      // 1. Pokaži popup (animacija klizanja dolje s vrha)
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        // Postavi timer za automatsko zatvaranje samo ako status nije već 0 (zatvoren)
        if (slideAnim._value === 1) { 
            timer = setTimeout(() => {
                handleClose();
            }, 3000); 
        }
      });
    } else {
      // Ako isVisible postane false, osiguraj da je animacija na nuli
      slideAnim.setValue(0);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [isVisible, slideAnim]);

  // Interpolacija za pomicanje (0 = skroz gore izvan ekrana, 1 = pozicija za prikaz)
  const popupHeight = 90; // Približna visina popup-a
  const topMargin = 50; // Margina od vrha ekrana (ispod status bar-a/notch-a)
  
  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-popupHeight, topMargin], // Klizi s vrha ekrana prema dolje
  });

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.contentWrapper}>
          <Text style={styles.text}>{message}</Text>
          {/* Gumb za ručno zatvaranje */}
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>OK</Text>
          </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Fiksna pozicija na VRHU zaslona
    position: 'absolute',
    left: 10,
    right: 10,
    top: 0, // Inicijalno je na vrhu, animacija ga spušta
    padding: 15,
    borderRadius: 8,
    // Sjane (shadow)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, 
    zIndex: 9999, // Osigurava da je na vrhu
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    flexShrink: 1, // Omogućuje tekstu da se smanji ako je predugačak
    marginRight: 10,
  },
  closeButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Prozirna bijela pozadina
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  }
});

export default StatusPopup;