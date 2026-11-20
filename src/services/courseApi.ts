import { Course } from '../types/course';

const API_URL = 'https://fakestoreapi.com/products';

export const fetchCourses = async (): Promise<Course[]> => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch products.');
  }

  const data: Course[] = await response.json();

  return data;
};