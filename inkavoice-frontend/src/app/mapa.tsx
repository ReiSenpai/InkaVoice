import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const C = {
  bg: '#E6ECE8',
  white: '#FFF',
  green: '#00332D',
  green2: '#1A3A1E',
  gold: '#C9A84C',
  border: '#E6E6E6',
  text: '#122014',
  muted: '#666',
};

const ROUTES = [
  {
    id: 1,
    name: 'Ruta Moche',
    km: '540km',
    desc: '4 Sitios Arqueológicos',
    img:
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da',
  },
  {
    id: 2,
    name: 'Camino Inca',
    km: '43km',
    desc: 'Trekking',
    img:
      'https://images.unsplash.com/photo-1587595431973-160d0d94add1',
  },
];

const PINS = [
  { id: 1, x: '20%', y: '24%', icon: 'water', color: '#F4D03F' },
  { id: 2, x: '58%', y: '40%', icon: 'leaf', color: '#00332D' },
  { id: 3, x: '52%', y: '70%', icon: 'diamond', color: '#00332D' },
];

export default function MapaScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState(1);

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        <TouchableOpacity
        onPress={() => {}}
        >
        <Ionicons
            name="search-outline"
            size={22}
            color={C.green}
        />
        </TouchableOpacity>

        <Text style={styles.title}>
          InkaVoice
        </Text>

        <TouchableOpacity>
          <Ionicons
            name="settings-outline"
            size={22}
            color={C.green}
          />
        </TouchableOpacity>

      </View>

      {/* MAPA */}
      <View style={styles.mapArea}>

        <View style={styles.fakeMap}>

          <Text style={styles.mapTitle}>
            Perú
          </Text>

          {PINS.map(pin => (
                <View
                key={pin.id}
                style={[
                    styles.pin,
                    {
                    left: pin.x as `${number}%`,
                    top: pin.y as `${number}%`,
                    },
                ]}
                >
              <View
                style={[
                  styles.pinCircle,
                  {
                    backgroundColor:
                      pin.color,
                  },
                ]}
              >
                <Ionicons
                  name={pin.icon as any}
                  size={16}
                  color="#FFF"
                />
              </View>
            </View>
          ))}

        </View>

        {/* BOTONES DERECHA */}

        <View style={styles.rightButtons}>

          <TouchableOpacity style={styles.floatBtn}>
            <Ionicons
              name="locate"
              size={20}
              color={C.green}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.floatBtn}>
            <Ionicons
              name="layers-outline"
              size={20}
              color={C.green}
            />
          </TouchableOpacity>

        </View>

      </View>

      {/* TARJETAS */}

      <View style={styles.bottomCard}>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >

          {ROUTES.map(route => (

            <TouchableOpacity
              key={route.id}
              onPress={() =>
                setSelected(route.id)
              }
              style={[
                styles.card,
                selected === route.id &&
                  styles.cardSelected,
              ]}
            >

              <Image
                source={{
                  uri: route.img,
                }}
                style={styles.cardImg}
              />

              <View style={styles.cardBody}>

                <Text style={styles.routeTitle}>
                  {route.name}
                </Text>

                <Text style={styles.routeMeta}>
                  {route.km} · {route.desc}
                </Text>

              </View>

            </TouchableOpacity>

          ))}

        </ScrollView>

        {/* BOTON */}

        <TouchableOpacity
          style={styles.startBtn}
          onPress={() =>
            router.push('/recorrido')
          }
        >

          <Ionicons
            name="add-circle"
            size={22}
            color="#FFF"
          />

          <Text style={styles.startText}>
            Iniciar Nuevo Recorrido
          </Text>

        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:C.bg,
},

header:{
paddingTop:55,
paddingHorizontal:20,
flexDirection:'row',
justifyContent:'space-between',
alignItems:'center',
backgroundColor:C.white,
},

title:{
fontSize:28,
fontWeight:'800',
color:C.green,
},

mapArea:{
flex:1,
},

fakeMap:{
flex:1,
margin:18,
borderRadius:30,
backgroundColor:'#D8E0DB',
overflow:'hidden',
},

mapTitle:{
marginTop:40,
textAlign:'center',
fontSize:30,
fontWeight:'800',
color:'#B5B5B5',
},

pin:{
position:'absolute',
},

pinCircle:{
width:40,
height:40,
borderRadius:20,
justifyContent:'center',
alignItems:'center',
},

rightButtons:{
position:'absolute',
right:20,
top:30,
gap:14,
},

floatBtn:{
width:50,
height:50,
borderRadius:15,
backgroundColor:'#FFF',
justifyContent:'center',
alignItems:'center',
},

bottomCard:{
position:'absolute',
bottom:25,
left:0,
right:0,
},

card:{
width:260,
marginLeft:18,
backgroundColor:'#FFF',
borderRadius:20,
overflow:'hidden',
},

cardSelected:{
borderWidth:2,
borderColor:C.green,
},

cardImg:{
width:'100%',
height:150,
},

cardBody:{
padding:14,
},

routeTitle:{
fontWeight:'800',
fontSize:18,
},

routeMeta:{
marginTop:6,
color:C.muted,
},

startBtn:{
alignSelf:'center',
marginTop:18,
height:58,
paddingHorizontal:24,
borderRadius:30,
backgroundColor:C.green,
flexDirection:'row',
alignItems:'center',
gap:10,
},

startText:{
color:'#FFF',
fontWeight:'700',
fontSize:16,
},

});