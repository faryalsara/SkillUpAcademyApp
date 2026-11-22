
import React from 'react';

import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  useAppDispatch,
  useAppSelector,
} from '../app/hooks';

import {
  addOrder,
  setLoading,
  setError,
} from '../features/orders/orderSlice';

import { setCartItems } from '../features/cart/cartSlice';

const CheckoutScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector(state => state.cart.items);
  const loading = useAppSelector(state => state.orders.loading);
  const error = useAppSelector(state => state.orders.error);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handlePlaceOrder = async () => {
    console.log('PLACE ORDER BUTTON PRESSED');

    if (cartItems.length === 0) {
      dispatch(setError('Your cart is empty.'));
      return;
    }

    dispatch(setError(null));
    dispatch(setLoading(true));

    const orderDate = new Date().toISOString();

    const orderBody = {
      items: cartItems,
      total: totalPrice,
      date: orderDate,
    };

    try {
      console.log('Sending order to ReqRes...');
      console.log('Order request body:', JSON.stringify(orderBody));

      const response = await fetch(
        'https://reqres.in/api/orders',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderBody),
        },
      );

      // Read raw response before updating UI
      const rawResponse = await response.text();

      console.log('ReqRes HTTP Status:', response.status);
      console.log('ReqRes Raw Response:', rawResponse);

      let responseData: any = {};

      try {
        responseData = rawResponse
          ? JSON.parse(rawResponse)
          : {};
      } catch {
        throw new Error('Invalid response received from server.');
      }

      if (!response.ok) {
        throw new Error(
          responseData.error ||
          `Request failed with status ${response.status}`,
        );
      }

      const newOrder = {
        id: String(Date.now()),
        apiOrderId: String(
          responseData.id ?? Date.now(),
        ),
        items: [...cartItems],
        total: totalPrice,
        date: orderDate,
        status: 'Confirmed' as const,
      };

      dispatch(addOrder(newOrder));
      dispatch(setCartItems([]));

      Alert.alert(
        'Order Successful!',
        'Your order has been placed successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Catalogue'),
          },
        ],
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.';

      console.log('ORDER ERROR:', message);

      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Checkout</Text>
      </View>

      <Text style={styles.sectionTitle}>
        Order Summary
      </Text>

      <FlatList
        data={cartItems}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Your cart is empty.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>
                {item.title}
              </Text>

              <Text style={styles.itemDetails}>
                Quantity: {item.quantity}
              </Text>
            </View>

            <Text style={styles.price}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        )}
      />

      <View style={styles.bottom}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>

          <Text style={styles.totalPrice}>
            ${totalPrice.toFixed(2)}
          </Text>
        </View>

        {error && (
          <Text style={styles.error}>
            {error}
          </Text>
        )}

        <Pressable
          style={[
            styles.button,
            (loading || cartItems.length === 0) &&
              styles.disabledButton,
          ]}
          disabled={loading || cartItems.length === 0}
          onPress={handlePlaceOrder}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              Place Order
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },

  backText: {
    color: '#333333',
    fontSize: 16,
  },

  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222222',
    marginRight: 45,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    paddingHorizontal: 20,
    marginTop: 10,
  },

  list: {
    padding: 20,
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  itemInfo: {
    flex: 1,
    marginRight: 10,
  },

  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222222',
  },

  itemDetails: {
    fontSize: 13,
    color: '#777777',
    marginTop: 5,
  },

  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222222',
  },

  emptyText: {
    textAlign: 'center',
    color: '#777777',
    marginTop: 30,
  },

  bottom: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
  },

  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
  },

  error: {
    color: '#DC2626',
    marginBottom: 12,
  },

  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.5,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
