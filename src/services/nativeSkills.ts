import * as Linking from 'expo-linking';
import * as SMS from 'expo-sms';
import * as Contacts from 'expo-contacts';
import * as Notifications from 'expo-notifications';

export async function openDialer(phoneNumber: string): Promise<void> {
  const url = `tel:${phoneNumber}`;
  const supported = await Linking.canOpenURL(url);
  if (!supported) throw new Error('Phone calls not supported on this device');
  await Linking.openURL(url);
}

export async function openSMS(phoneNumber: string, body: string): Promise<void> {
  const available = await SMS.isAvailableAsync();
  if (!available) throw new Error('SMS not available on this device');
  await SMS.sendSMSAsync([phoneNumber], body);
}

export async function searchContacts(name: string): Promise<Contacts.Contact[]> {
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
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: triggerSeconds },
  });
}
