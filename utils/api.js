import { AsyncStorage } from 'react-native';
import { formatCalendarResults, CALENDAR_STORAGE_KEY } from './_calendar';

export function fetchCalendarResults() {
  return AsyncStorage.getItem(CALENDAR_STORAGE_KEY)
    .then(formatCalendarResults);
}

export function submitEntry({ key, entry }) {
  AsyncStorage.mergeItem(CALENDAR_STORAGE_KEY, JSON.stringify({
    [key]: entry
  }));
}

export function removeEntry(key) {
  AsyncStorage.getItem(CALENDAR_STORAGE_KEY).then(results => {
    const data = JSON.parse(results);
    data[ key ] = undefined;
    delete data[ key ];
    AsyncStorage.mergeItem(CALENDAR_STORAGE_KEY, JSON.stringify(data));
  });
}