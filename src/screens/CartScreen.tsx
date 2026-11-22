
import React, { useState } from 'react';

import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Modal,
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

  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [removeVisible, setRemoveVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  const cartItems = useAppSelector(
    state => state.cart.items,
  );

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

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

  // Open remove confirmation modal
  const handleRemove = (id: number) => {
    setSelectedCourse(id);
    setRemoveVisible(true);
  };

  // Confirm course removal
  const confirmRemove = () => {
    if (selectedCourse !== null) {
      dispatch(removeItem(selectedCourse));
    }

    setRemoveVisible(false);
    setSelectedCourse(null);
  };

  // Cancel removal
  const cancelRemove = () => {
    setRemoveVisible(false);
    setSelectedCourse(null);
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
  onPress={() => navigation.navigate('Checkout')}
>
  <Text style={styles.checkoutText}>
    Proceed to Checkout
  </Text>
</Pressable>
          </View>
        </>
      )}

      {/* Custom Remove Confirmation Modal */}
      <Modal
        visible={removeVisible}
        transparent
        animationType="fade"
        onRequestClose={cancelRemove}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.removeModalCard}>

            <Pressable
              style={styles.closeButton}
              onPress={cancelRemove}
            >
              <Text style={styles.closeText}>×</Text>
            </Pressable>

            <View style={styles.removeIconContainer}>
              <Text style={styles.removeIcon}>🗑</Text>
            </View>

            <Text style={styles.removeModalTitle}>
              Remove Course?
            </Text>

            <Text style={styles.removeModalMessage}>
              Are you sure you want to remove this course from your cart?
            </Text>

            <View style={styles.removeModalButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={cancelRemove}
              >
                <Text style={styles.cancelButtonText}>
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                style={styles.confirmRemoveButton}
                onPress={confirmRemove}
              >
                <Text style={styles.confirmRemoveText}>
                  Remove
                </Text>
              </Pressable>
            </View>

          </View>
        </View>
      </Modal>

      {/* Custom Checkout Modal */}
      <Modal
        visible={checkoutVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCheckoutVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <Pressable
              style={styles.closeButton}
              onPress={() => setCheckoutVisible(false)}
            >
              <Text style={styles.closeText}>×</Text>
            </Pressable>

            <View style={styles.modalIcon}>
              <Text style={styles.bagIcon}>🛍️</Text>
            </View>

            <Text style={styles.modalTitle}>
              Order Summary
            </Text>

            <Text style={styles.modalSubtitle}>
              Here's a summary of your selected courses.
            </Text>

            <View style={styles.modalDivider} />

            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>
                Total Courses
              </Text>

              <Text style={styles.modalValue}>
                {totalItems}
              </Text>
            </View>

            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>
                Order Total
              </Text>

              <Text style={styles.modalPrice}>
                ${totalPrice.toFixed(2)}
              </Text>
            </View>

            <Pressable
              style={styles.modalButton}
              onPress={() => setCheckoutVisible(false)}
            >
              <Text style={styles.modalButtonText}>
                Continue Shopping
              </Text>
            </Pressable>

            <Text style={styles.modalFooter}>
              Thank you for choosing SkillUp Academy!
            </Text>

          </View>
        </View>
      </Modal>

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

  // Shared modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },

  closeButton: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeText: {
    fontSize: 23,
    color: '#64748B',
    lineHeight: 27,
  },

  // Remove confirmation modal
 
removeModalCard: {
  width: '85%',
  maxWidth: 310,
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  padding: 18,
  alignItems: 'center',
  elevation: 10,
},

removeIconContainer: {
  width: 55,
  height: 55,
  borderRadius: 28,
  backgroundColor: '#FEE2E2',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 2,
  marginBottom: 12,
},

removeIcon: {
  fontSize: 25,
},

removeModalTitle: {
  fontSize: 19,
  fontWeight: 'bold',
  color: '#172554',
},

removeModalMessage: {
  fontSize: 12,
  color: '#64748B',
  textAlign: 'center',
  marginTop: 7,
  marginBottom: 18,
  lineHeight: 18,
},

removeModalButtons: {
  flexDirection: 'row',
  width: '100%',
  gap: 10,
},

cancelButton: {
  flex: 1,
  backgroundColor: '#E2E8F0',
  paddingVertical: 11,
  borderRadius: 10,
  alignItems: 'center',
},

cancelButtonText: {
  color: '#334155',
  fontSize: 13,
  fontWeight: 'bold',
},

confirmRemoveButton: {
  flex: 1,
  backgroundColor: '#DC2626',
  paddingVertical: 11,
  borderRadius: 10,
  alignItems: 'center',
},

confirmRemoveText: {
  color: '#FFFFFF',
  fontSize: 13,
  fontWeight: 'bold',
},


  // Checkout modal styles
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 25,
    alignItems: 'center',
    elevation: 12,
  },

  modalIcon: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15,
  },

  bagIcon: {
    fontSize: 35,
  },

  modalTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#172554',
  },

  modalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },

  modalDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 22,
  },

  modalRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  modalLabel: {
    fontSize: 14,
    color: '#64748B',
  },

  modalValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#172554',
  },

  modalPrice: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#3157D5',
  },

  modalButton: {
    width: '100%',
    backgroundColor: '#3157D5',
    paddingVertical: 16,
    borderRadius: 13,
    alignItems: 'center',
    marginTop: 8,
  },

  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  modalFooter: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 17,
    textAlign: 'center',
  },
});

export default CartScreen;
