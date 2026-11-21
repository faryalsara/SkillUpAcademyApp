
import React from 'react';

import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  removeItem,
  updateQuantity,
} from '../features/cart/cartSlice';

import {
  useAppDispatch,
  useAppSelector,
} from '../app/hooks';

const CartScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector(
    state => state.cart.items,
  );

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // Calculate total quantity
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // Increase quantity
  const increaseQuantity = (id: number, quantity: number) => {
    dispatch(
      updateQuantity({
        id,
        quantity: quantity + 1,
      }),
    );
  };

  // Decrease quantity
  const decreaseQuantity = (id: number, quantity: number) => {
    if (quantity > 1) {
      dispatch(
        updateQuantity({
          id,
          quantity: quantity - 1,
        }),
      );
    }
  };

  // Remove course
  const handleRemove = (id: number) => {
    Alert.alert(
      'Remove Course',
      'Are you sure you want to remove this course?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => dispatch(removeItem(id)),
        },
      ],
    );
  };

  // Render cart item
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.courseImage}
        resizeMode="contain"
      />

      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.price}>
          ${item.price.toFixed(2)}
        </Text>

        <View style={styles.quantityRow}>
          <Pressable
            style={styles.quantityButton}
            onPress={() =>
              decreaseQuantity(item.id, item.quantity)
            }
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </Pressable>

          <Text style={styles.quantity}>
            {item.quantity}
          </Text>

          <Pressable
            style={styles.quantityButton}
            onPress={() =>
              increaseQuantity(item.id, item.quantity)
            }
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </Pressable>

          <Pressable
            style={styles.removeButton}
            onPress={() => handleRemove(item.id)}
          >
            <Text style={styles.removeText}>Remove</Text>
          </Pressable>
        </View>

        <Text style={styles.subtotal}>
          Subtotal: ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>

        <Text style={styles.headerTitle}>My Cart</Text>

        <View style={{ width: 55 }} />
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>

          <Text style={styles.emptyTitle}>
            Your Cart is Empty
          </Text>

          <Text style={styles.emptyMessage}>
            Add some courses to get started!
          </Text>

          <Pressable
            style={styles.shopButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.shopButtonText}>
              Browse Courses
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />

          {/* Cart Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Total Items
              </Text>

              <Text style={styles.summaryValue}>
                {totalItems}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>
                Total Price
              </Text>

              <Text style={styles.totalPrice}>
                ${totalPrice.toFixed(2)}
              </Text>
            </View>

            <Pressable
              style={styles.checkoutButton}
              onPress={() =>
                Alert.alert(
                  'Checkout',
                  `Your total amount is $${totalPrice.toFixed(2)}.`,
                )
              }
            >
              <Text style={styles.checkoutText}>
                Proceed to Checkout
              </Text>
            </Pressable>
          </View>
        </>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },

  backButton: {
    width: 55,
  },

  backText: {
    color: '#3157D5',
    fontSize: 15,
    fontWeight: 'bold',
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#172554',
  },

  list: {
    padding: 16,
    paddingBottom: 20,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 15,
    marginBottom: 14,
    elevation: 3,
  },

  courseImage: {
    width: 90,
    height: 120,
  },

  courseInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },

  courseTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#172554',
  },

  price: {
    color: '#3157D5',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 7,
  },

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  quantityButton: {
    width: 29,
    height: 29,
    borderRadius: 8,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityButtonText: {
    fontSize: 19,
    color: '#3157D5',
    fontWeight: 'bold',
  },

  quantity: {
    marginHorizontal: 12,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#172554',
  },

  removeButton: {
    marginLeft: 12,
  },

  removeText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: 'bold',
  },

  subtotal: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 9,
  },

  summary: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    elevation: 8,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  summaryLabel: {
    color: '#64748B',
    fontSize: 14,
  },

  summaryValue: {
    color: '#172554',
    fontWeight: 'bold',
  },

  totalLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#172554',
  },

  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3157D5',
  },

  checkoutButton: {
    backgroundColor: '#3157D5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },

  checkoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },

  emptyIcon: {
    fontSize: 65,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#172554',
    marginTop: 15,
  },

  emptyMessage: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
  },

  shopButton: {
    backgroundColor: '#3157D5',
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 22,
  },

  shopButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default CartScreen;
