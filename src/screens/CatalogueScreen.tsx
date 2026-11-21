
import React, { useCallback, useEffect } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Course } from '../types/course';
import { fetchCourses } from '../services/courseApi';

import {
  setLoading,
  setCourses,
  setOfflineCourses,
  setError,
} from '../features/courses/coursesSlice';

import {
  addItem,
} from '../features/cart/cartSlice';

import {
  useAppDispatch,
  useAppSelector,
} from '../app/hooks';

const CACHE_KEY = '@skillup_courses';

const CatalogueScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();

  const { courses, loading, error, isOffline } =
    useAppSelector(state => state.courses);

  const cartItems = useAppSelector(
    state => state.cart.items,
  );

  // Calculate total number of courses in cart
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // Load courses from API or cache
  const loadCourses = useCallback(async () => {
    dispatch(setLoading(true));

    let cachedCourses: Course[] = [];

    try {
      const savedData = await AsyncStorage.getItem(CACHE_KEY);

      if (savedData) {
        cachedCourses = JSON.parse(savedData) as Course[];
        dispatch(setCourses(cachedCourses));
      }
    } catch (cacheError) {
      console.warn('Could not read cached courses:', cacheError);
    }

    try {
      const freshCourses = await fetchCourses();

      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify(freshCourses),
      );

      dispatch(setCourses(freshCourses));
    } catch (apiError) {
      if (cachedCourses.length > 0) {
        dispatch(setOfflineCourses(cachedCourses));
      } else {
        dispatch(
          setError(
            apiError instanceof Error
              ? apiError.message
              : 'Unable to load courses.',
          ),
        );
      }
    }
  }, [dispatch]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Add course to cart
  const handleAddToCart = (course: Course) => {
    dispatch(addItem(course));

    Alert.alert(
      'Added to Cart',
      `${course.title} has been added to your cart.`,
    );
  };

  // Render each course
  const renderCourse = ({ item }: { item: Course }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.courseImage}
        resizeMode="contain"
      />

      <View style={styles.courseInfo}>
        <Text style={styles.category}>
          {item.category}
        </Text>

        <Text style={styles.courseTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>
            ${item.price.toFixed(2)}
          </Text>

          <Text style={styles.rating}>
            ★ {item.rating.rate}
          </Text>
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => handleAddToCart(item)}
        >
          <Text style={styles.addButtonText}>
            + Add to Cart
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            SkillUp Courses
          </Text>

          <Text style={styles.headerSubtitle}>
            Discover something new today
          </Text>
        </View>

        <Pressable
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.cartIcon}>🛒</Text>

          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {cartCount}
              </Text>
            </View>
          )}
        </Pressable>

        {isOffline && (
          <View style={styles.offlineBadge}>
            <Text style={styles.offlineText}>
              Offline
            </Text>
          </View>
        )}
      </View>

      {loading && courses.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#3157D5"
          />

          <Text style={styles.message}>
            Loading courses...
          </Text>
        </View>
      ) : error && courses.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {error}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={loadCourses}
          >
            <Text style={styles.retryText}>
              Try Again
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={courses}
          renderItem={renderCourse}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.message}>
              No courses available.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#172554',
  },

  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 5,
  },

  cartButton: {
    backgroundColor: '#E0E7FF',
    width: 48,
    height: 48,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  cartIcon: {
    fontSize: 23,
  },

  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EF4444',
    width: 21,
    height: 21,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },

  offlineBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },

  offlineText: {
    color: '#92400E',
    fontWeight: 'bold',
    fontSize: 12,
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  courseImage: {
    width: 105,
    height: 125,
    backgroundColor: '#FFFFFF',
  },

  courseInfo: {
    flex: 1,
    marginLeft: 13,
    justifyContent: 'center',
  },

  category: {
    color: '#3157D5',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },

  courseTitle: {
    color: '#172554',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },

  description: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 5,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  price: {
    color: '#3157D5',
    fontSize: 16,
    fontWeight: 'bold',
  },

  rating: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: 'bold',
  },

  addButton: {
    backgroundColor: '#3157D5',
    paddingVertical: 9,
    borderRadius: 9,
    alignItems: 'center',
    marginTop: 10,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },

  message: {
    color: '#64748B',
    marginTop: 12,
    textAlign: 'center',
  },

  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 15,
  },

  retryButton: {
    backgroundColor: '#3157D5',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },

  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default CatalogueScreen;
