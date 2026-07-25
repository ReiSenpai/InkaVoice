import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { colors } from '../theme/colors';

type AlertButton = {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
};

type AlertContextType = {
  alert: (title: string, message?: string, buttons?: AlertButton[]) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [buttons, setButtons] = useState<AlertButton[]>([{ text: 'OK' }]);

  const alert = (t: string, m?: string, b?: AlertButton[]) => {
    setTitle(t);
    setMessage(m);
    setButtons(b && b.length > 0 ? b : [{ text: 'OK' }]);
    setVisible(true);
  };

  const handlePress = (btn: AlertButton) => {
    setVisible(false);
    setTimeout(() => btn.onPress?.(), 150);
  };

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            {message ? <Text style={styles.message}>{message}</Text> : null}

            <View style={buttons.length > 2 ? styles.buttonsColumn : styles.buttonsRow}>
              {buttons.map((btn, index) => {
                const isDestructive = btn.style === 'destructive';
                const isCancel = btn.style === 'cancel';
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      isDestructive && styles.buttonDestructive,
                      isCancel && styles.buttonCancel,
                      !isDestructive && !isCancel && styles.buttonDefault,
                      buttons.length > 2 && styles.buttonFullWidth,
                    ]}
                    onPress={() => handlePress(btn)}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        isDestructive && styles.buttonTextDestructive,
                        isCancel && styles.buttonTextCancel,
                        !isDestructive && !isCancel && styles.buttonTextDefault,
                      ]}
                    >
                      {btn.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert debe usarse dentro de AlertProvider');
  return ctx;
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 32 },
  card: { width: '100%', backgroundColor: colors.white, borderRadius: 20, padding: 24 },
  title: { fontSize: 18, fontWeight: '800', color: colors.green, textAlign: 'center', marginBottom: 8 },
  message: { fontSize: 14, color: colors.gray600, textAlign: 'center', lineHeight: 21, marginBottom: 20 },
  buttonsRow: { flexDirection: 'row', gap: 10 },
  buttonsColumn: { flexDirection: 'column', gap: 10 },
  button: { flex: 1, paddingVertical: 13, borderRadius: 12, alignItems: 'center' },
  buttonFullWidth: { flex: undefined, width: '100%' },
  buttonDefault: { backgroundColor: colors.green },
  buttonCancel: { backgroundColor: colors.gray100 },
  buttonDestructive: { backgroundColor: '#FDE8E8' },
  buttonText: { fontSize: 14, fontWeight: '700' },
  buttonTextDefault: { color: colors.white },
  buttonTextCancel: { color: colors.gray600 },
  buttonTextDestructive: { color: '#D64545' },
});
