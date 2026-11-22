
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppSelector } from '../app/hooks';

const OrdersScreen = () => {
  const orders = useAppSelector(state => state.orders.orders);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>My Orders</Text>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptyText}>
            Your placed orders will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>
                  Order #{item.apiOrderId}
                </Text>
                <Text style={styles.status}>
                  {item.status}
                </Text>
              </View>

              <Text style={styles.date}>
                {formatDate(item.date)}
              </Text>

              {item.items.map((course, index) => (
                <View key={`${course.id}-${index}`} style={styles.itemRow}>
                  <Text style={styles.itemName}>
                    {course.title}
                  </Text>
                  <Text style={styles.itemQuantity}>
                    x {course.quantity}
                  </Text>
                </View>
              ))}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.total}>
                  Rs. {item.total}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#172B4D',
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172B4D',
  },
  emptyText: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
  },
  list: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#172B4D',
  },
  status: {
    color: '#16834A',
    fontWeight: '600',
  },
  date: {
    color: '#777',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 14,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    color: '#333',
    fontSize: 14,
    flex: 1,
  },
  itemQuantity: {
    color: '#555',
    fontSize: 14,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16834A',
  },
});

export default OrdersScreen;
