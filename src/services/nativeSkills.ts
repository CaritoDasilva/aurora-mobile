import { Platform } from 'react-native';
import * as Linking from 'expo-linking';
import * as SMS from 'expo-sms';
import * as Contacts from 'expo-contacts';
import * as Notifications from 'expo-notifications';
import type { NativeAction } from '../types';

const REMINDER_CHANNEL = 'aurora-recordatorios';

// Llamar una vez al iniciar la app: muestra los recordatorios aunque Aurora esté abierta
// y crea el canal de Android (obligatorio para notificaciones locales en Android 8+).
export async function setupNotifications(): Promise<void> {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL, {
      name: 'Recordatorios de Aurora',
      importance: Notifications.AndroidImportance.MAX,
    });
  }
}

export async function openDialer(phoneNumber: string): Promise<void> {
  const url = `tel:${phoneNumber}`;
  const supported = await Linking.canOpenURL(url);
  if (!supported) throw new Error('Este teléfono no puede hacer llamadas');
  await Linking.openURL(url);
}

export async function openSMS(phoneNumber: string, body: string): Promise<void> {
  const available = await SMS.isAvailableAsync();
  if (!available) throw new Error('Este teléfono no puede enviar mensajes');
  await SMS.sendSMSAsync([phoneNumber], body);
}

export async function searchContacts(name: string): Promise<Contacts.ExistingContact[]> {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== 'granted') throw new Error('Contacts permission denied');
  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
    name,
  });
  return data;
}

export async function scheduleReminder(
  title: string,
  body: string,
  triggerSeconds: number
): Promise<void> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') throw new Error('Notifications permission denied');
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: triggerSeconds,
      channelId: REMINDER_CHANNEL,
    },
  });
}

// Ejecuta en el teléfono la acción que pidió el servidor.
// Llamadas y SMS solo abren el marcador / redactor: la persona siempre da el último toque.
export async function runNativeAction(action: NativeAction): Promise<void> {
  switch (action.type) {
    case 'call':
      return openDialer(action.phone);
    case 'sms':
      return openSMS(action.phone, action.body);
    case 'reminder':
      return scheduleReminder(action.title, action.body, action.triggerSeconds);
  }
}
