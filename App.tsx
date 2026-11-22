
import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  View,
} from 'react-native';

import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { store } from './src/app/store';
import { useAppSelector } from './src/app/hooks';

import AppNavigator from './src/navigation/AppNavigator';

import {
  loadCart,
  saveCart,
} from './src/services/cartStorage';

import {
  loadOrders,
  saveOrders,
} from './src/services/orderStorage';

import { setCartItems } from './src/features/cart/cartSlice';
import { setOrders } from './src/features/orders/orderSlice';

// Automatically save cart and orders whenever Redux state changes
const DataPersistence = () => {
  const cartItems = useAppSelector(state => state.cart.items);
  const orders = useAppSelector(state => state.orders.orders);

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  return null;
};

// Main application
const App = () => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Restore cart and orders when application starts
  useEffect(() => {
    const initializeData = async () => {
      try {
        const [savedCart, savedOrders] = await Promise.all([
          loadCart(),
          loadOrders(),
        ]);

        store.dispatch(setCartItems(savedCart));
        store.dispatch(setOrders(savedOrders));

        console.log('Cart restored:', savedCart);
        console.log('Orders restored:', savedOrders);
      } catch (error) {
        console.error('Data initialization failed:', error);
      } finally {
        setIsDataLoaded(true);
      }
    };

    initializeData();
  }, []);

  // Show loading indicator until data is restored
  if (!isDataLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator
          size="large"
          color="#3157D5"
        />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <DataPersistence />
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
