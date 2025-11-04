export interface Note {
  id: string;
  creationDate: string;
  modificationDate: string;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  content: string;
  userId: string;
  images: { url: string; deleteUrl: string }[];
}
