export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Resultado: { nombre?: string; region?: string; photoUri?: string; siteName?: string } | undefined;
  Audioguia: { nombre?: string; region?: string; photoUri?: string } | undefined;
  Asistente: { siteName?: string } | undefined;
  Settings: undefined;
  Emergencia: undefined;
  Recorrido: { region?: string; siteName?: string } | undefined;
  RecorridoEnCurso: undefined;   
};

export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  Routes: undefined;
  ARView: undefined;
  History: undefined;
  Profile: undefined;
};