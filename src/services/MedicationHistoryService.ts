import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

class MedicationHistoryService {
  async recordMedicationTaken(medicationId: string, takenAt: Date = new Date()) {
    const userId = auth().currentUser?.uid;
    if (!userId) return;

    const historyRef = firestore()
      .collection('users')
      .doc(userId)
      .collection('medicationHistory');

    await historyRef.add({
      medicationId,
      takenAt,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    // Atualizar estoque
    await this.updateMedicationStock(medicationId);
  }

  async getMedicationHistory(medicationId?: string) {
    const userId = auth().currentUser?.uid;
    if (!userId) return [];

    const historyRef = firestore()
      .collection('users')
      .doc(userId)
      .collection('medicationHistory');

    let query = historyRef.orderBy('takenAt', 'desc');
    if (medicationId) {
      query = query.where('medicationId', '==', medicationId);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  private async updateMedicationStock(medicationId: string) {
    const userId = auth().currentUser?.uid;
    if (!userId) return;

    const medicationRef = firestore()
      .collection('users')
      .doc(userId)
      .collection('medications')
      .doc(medicationId);

    const medicationDoc = await medicationRef.get();
    if (!medicationDoc.exists) return;

    const medicationData = medicationDoc.data();
    if (!medicationData) return;

    const currentAmount = medicationData.amount || 0;
    if (currentAmount > 0) {
      await medicationRef.update({
        amount: currentAmount - 1,
      });

      // Se o estoque estiver baixo, criar alerta
      if (currentAmount - 1 <= 5) {
        await this.createLowStockAlert(medicationId, medicationData.name);
      }
    }
  }

  private async createLowStockAlert(medicationId: string, medicationName: string) {
    const userId = auth().currentUser?.uid;
    if (!userId) return;

    const alertsRef = firestore()
      .collection('users')
      .doc(userId)
      .collection('alerts');

    await alertsRef.add({
      type: 'LOW_STOCK',
      medicationId,
      medicationName,
      createdAt: firestore.FieldValue.serverTimestamp(),
      read: false,
    });
  }

  async getAlerts() {
    const userId = auth().currentUser?.uid;
    if (!userId) return [];

    const alertsRef = firestore()
      .collection('users')
      .doc(userId)
      .collection('alerts')
      .orderBy('createdAt', 'desc')
      .where('read', '==', false);

    const snapshot = await alertsRef.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async markAlertAsRead(alertId: string) {
    const userId = auth().currentUser?.uid;
    if (!userId) return;

    const alertRef = firestore()
      .collection('users')
      .doc(userId)
      .collection('alerts')
      .doc(alertId);

    await alertRef.update({
      read: true,
    });
  }
}

export default new MedicationHistoryService();
