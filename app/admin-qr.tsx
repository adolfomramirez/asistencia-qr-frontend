import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

type Session = {
  id: string;
  date: string;
  time: string;
  teacher: string;
  course: string;
};

// ============================================
// COMPONENTES HTML5 NATIVOS PARA FECHAS WEB
// ============================================
const WebDateInput = ({ value, onChange, placeholder }: any) => {
  return React.createElement('input', {
    type: 'date',
    value,
    placeholder,
    onChange: (e: any) => onChange(e.target.value),
    style: {
      padding: '12px 14px',
      borderRadius: '10px',
      border: '1px solid #E5E7EB',
      backgroundColor: '#F9FAFB',
      fontSize: '15px',
      color: '#111827',
      width: '100%',
      boxSizing: 'border-box',
      outline: 'none',
      marginBottom: '16px',
      fontFamily: 'inherit'
    }
  });
};

const WebTimeInput = ({ value, onChange, placeholder }: any) => {
  return React.createElement('input', {
    type: 'time',
    value,
    placeholder,
    onChange: (e: any) => onChange(e.target.value),
    style: {
      padding: '12px 14px',
      borderRadius: '10px',
      border: '1px solid #E5E7EB',
      backgroundColor: '#F9FAFB',
      fontSize: '15px',
      color: '#111827',
      width: '100%',
      boxSizing: 'border-box',
      outline: 'none',
      marginBottom: '16px',
      fontFamily: 'inherit'
    }
  });
};

// ============================================
// PANTALLA PRINCIPAL
// ============================================
export default function AdminQRScreen() {
  const router = useRouter();
  const [teacher, setTeacher] = useState('');
  const [course, setCourse] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const [sessions, setSessions] = useState<Session[]>([]);

  // Picker States (solo para App Móvil)
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // QR Modal States
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [qrFormat, setQrFormat] = useState<'JSON' | 'URL'>('JSON');
  const [qrSize, setQrSize] = useState<number>(250);
  const [isDynamicSize, setIsDynamicSize] = useState(false);
  const [dynamicSizeInput, setDynamicSizeInput] = useState('250');

  const generateSessions = () => {
    if (!teacher || !course || !startDate || !scheduleTime) {
      alert('Por favor, completa al menos el catedrático, curso, fecha inicio y horario.');
      return;
    }
    
    const newSession: Session = {
      id: Math.random().toString(36).substr(2, 9),
      date: startDate,
      time: scheduleTime,
      teacher,
      course,
    };

    setSessions([...sessions, newSession]);
  };

  const removeSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  const openQRModal = (session: Session) => {
    setSelectedSession(session);
    setQrModalVisible(true);
  };

  const getQRValue = () => {
    if (!selectedSession) return 'Empty';
    if (qrFormat === 'JSON') {
      return JSON.stringify(selectedSession);
    } else {
      const baseUrl = 'https://mi-dominio.com/asistencia';
      return `${baseUrl}?id=${selectedSession.id}&course=${encodeURIComponent(selectedSession.course)}`;
    }
  };

  const currentSize = isDynamicSize ? (parseInt(dynamicSizeInput) || 250) : 250;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: 'Admin QR', headerShown: true }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/perfil')}>
            <View style={styles.backButtonIconWrap}>
               <Ionicons name="arrow-back" size={18} color="#4F46E5" />
            </View>
            <Text style={styles.backButtonText}>Regresar a Perfil</Text>
          </TouchableOpacity>

          <View style={styles.heroSection}>
             <View style={styles.iconCircle}>
                <Ionicons name="qr-code" size={32} color="#FFF" />
             </View>
             <Text style={styles.headerTitle}>Generador QR</Text>
             <Text style={styles.subtitle}>Crea sesiones académicas y exporta accesos</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionHeaderTitle}>Información de Clase</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Catedrático</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Juan Pérez"
                placeholderTextColor="#9CA3AF"
                value={teacher}
                onChangeText={setTeacher}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Curso</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Matemáticas Discretas"
                placeholderTextColor="#9CA3AF"
                value={course}
                onChangeText={setCourse}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.flex1}>
                <Text style={styles.label}>Fecha Inicio</Text>
                {Platform.OS === 'web' ? (
                  <WebDateInput value={startDate} onChange={setStartDate} placeholder="Inicio" />
                ) : (
                  <>
                    <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                      <View pointerEvents="none">
                        <TextInput
                          style={styles.input}
                          placeholder="DD/MM/AAAA"
                          placeholderTextColor="#9CA3AF"
                          value={startDate}
                          editable={false}
                        />
                      </View>
                    </TouchableOpacity>
                    {showStartPicker && (
                      <DateTimePicker
                        value={startDate ? new Date(startDate + "T12:00:00") : new Date()}
                        mode="date"
                        display="default"
                        onChange={(event: any, date?: Date) => {
                          setShowStartPicker(Platform.OS === 'ios');
                          if (event.type === 'set' && date) setStartDate(date.toISOString().split('T')[0]);
                        }}
                      />
                    )}
                  </>
                )}
              </View>
              <View style={{ width: 14 }} />
              <View style={styles.flex1}>
                <Text style={styles.label}>Fecha Fin</Text>
                {Platform.OS === 'web' ? (
                  <WebDateInput value={endDate} onChange={setEndDate} placeholder="Fin" />
                ) : (
                  <>
                    <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                      <View pointerEvents="none">
                        <TextInput
                          style={styles.input}
                          placeholder="DD/MM/AAAA"
                          placeholderTextColor="#9CA3AF"
                          value={endDate}
                          editable={false}
                        />
                      </View>
                    </TouchableOpacity>
                    {showEndPicker && (
                      <DateTimePicker
                        value={endDate ? new Date(endDate + "T12:00:00") : new Date()}
                        mode="date"
                        display="default"
                        onChange={(event: any, date?: Date) => {
                          setShowEndPicker(Platform.OS === 'ios');
                          if (event.type === 'set' && date) setEndDate(date.toISOString().split('T')[0]);
                        }}
                      />
                    )}
                  </>
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Horario de la sesión</Text>
              {Platform.OS === 'web' ? (
                <WebTimeInput value={scheduleTime} onChange={setScheduleTime} placeholder="18:00" />
              ) : (
                <>
                  <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                    <View pointerEvents="none">
                      <TextInput
                        style={styles.input}
                        placeholder="Ej. 18:00"
                        placeholderTextColor="#9CA3AF"
                        value={scheduleTime}
                        editable={false}
                      />
                    </View>
                  </TouchableOpacity>
                  {showTimePicker && (
                    <DateTimePicker
                      value={scheduleTime ? (() => { let d = new Date(); const [h,m] = scheduleTime.split(':'); d.setHours(parseInt(h), parseInt(m),0); return d; })() : new Date()}
                      mode="time"
                      display="default"
                      onChange={(event: any, date?: Date) => {
                        setShowTimePicker(Platform.OS === 'ios');
                        if (event.type === 'set' && date) {
                          const hours = date.getHours().toString().padStart(2, '0');
                          const mins = date.getMinutes().toString().padStart(2, '0');
                          setScheduleTime(`${hours}:${mins}`);
                        }
                      }}
                    />
                  )}
                </>
              )}
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={generateSessions}>
              <Text style={styles.primaryButtonText}>Generar Lotes de Sesiones</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sessionsContainer}>
            <View style={styles.sessionHeaderRow}>
               <Text style={styles.sectionTitle}>Listado de Sesiones</Text>
               <View style={styles.sessionBadge}>
                  <Text style={styles.sessionBadgeText}>{sessions.length}</Text>
               </View>
            </View>
            
            {sessions.map((session) => (
              <View key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionCourse}>{session.course}</Text>
                  <Text style={styles.sessionDetail}>
                    <Ionicons name="person-outline" size={14} color="#6B7280" />  {session.teacher}
                  </Text>
                  <Text style={styles.sessionDetail}>
                    <Ionicons name="calendar-outline" size={14} color="#6B7280" />  {session.date}   •   <Ionicons name="time-outline" size={14} color="#6B7280" /> {session.time}
                  </Text>
                </View>
                <View style={styles.sessionActions}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => removeSession(session.id)}
                  >
                    <Ionicons name="trash" size={20} color="#EF4444" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.iconButton, styles.qrIconButton]}
                    onPress={() => openQRModal(session)}
                  >
                    <Ionicons name="qr-code" size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            {sessions.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={40} color="#CBD5E1" />
                <Text style={styles.emptyStateText}>No has generado ninguna sesión aún.</Text>
                <Text style={styles.emptyStateSub}>Rellena el formulario arriba y haz clic en generar.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* QR Code Modal */}
      <Modal
        visible={qrModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Código de Asistencia</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setQrModalVisible(false)}>
                <Ionicons name="close" size={22} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.formatSelector}>
                <TouchableOpacity
                  style={[styles.formatTab, qrFormat === 'JSON' && styles.formatTabActive]}
                  onPress={() => setQrFormat('JSON')}
                >
                  <Text style={[styles.formatTabText, qrFormat === 'JSON' && styles.formatTabTextActive]}>Estructurado (JSON)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.formatTab, qrFormat === 'URL' && styles.formatTabActive]}
                  onPress={() => setQrFormat('URL')}
                >
                  <Text style={[styles.formatTabText, qrFormat === 'URL' && styles.formatTabTextActive]}>Enlace Web (URL)</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.sizeConfig}>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setIsDynamicSize(!isDynamicSize)}
                >
                  <Ionicons name={isDynamicSize ? 'checkbox' : 'square-outline'} size={22} color="#4F46E5" />
                  <Text style={styles.checkboxLabel}>Personalizar escala en píxeles</Text>
                </TouchableOpacity>
                {isDynamicSize && (
                  <TextInput
                    style={styles.sizeInput}
                    keyboardType="numeric"
                    value={dynamicSizeInput}
                    onChangeText={setDynamicSizeInput}
                    placeholder="Ej. 250"
                  />
                )}
              </View>

              <View style={styles.qrDisplayArea}>
                {qrModalVisible && (
                  <View style={styles.qrShadowBox}>
                     <QRCode
                       value={getQRValue()}
                       size={currentSize}
                       color="#0A0A0A"
                       backgroundColor="#FFFFFF"
                     />
                  </View>
                )}
              </View>
              <View style={styles.targetCard}>
                 <Text style={styles.targetCardTitle}>Destino actual del QR:</Text>
                 <Text style={styles.qrValueText} numberOfLines={4}>{getQRValue()}</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    maxWidth: 700,
    width: '100%',
    alignSelf: 'center'
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start'
  },
  backButtonIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  backButtonText: {
    color: '#4F46E5',
    fontSize: 15,
    marginLeft: 8,
    fontWeight: '700',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10
  },
  iconCircle: {
     width: 64,
     height: 64,
     borderRadius: 32,
     backgroundColor: '#4F46E5',
     alignItems: 'center',
     justifyContent: 'center',
     marginBottom: 16,
     shadowColor: '#4F46E5',
     shadowOpacity: 0.4,
     shadowRadius: 10,
     shadowOffset: { width: 0, height: 4 }
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    marginBottom: 30,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 10
  },
  inputGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
    marginBottom: 0
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 14,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  sessionsContainer: {
    flex: 1,
  },
  sessionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
  },
  sessionBadge: {
    marginLeft: 10,
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12
  },
  sessionBadgeText: {
    color: '#4F46E5',
    fontWeight: '800',
    fontSize: 13
  },
  sessionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  sessionInfo: {
    flex: 1,
  },
  sessionCourse: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 6,
  },
  sessionDetail: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    fontWeight: '500'
  },
  sessionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    marginLeft: 10,
  },
  qrIconButton: {
    backgroundColor: '#4F46E5',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  emptyStateText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12
  },
  emptyStateSub: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 420,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 15 },
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  closeBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 6
  },
  modalBody: {},
  formatSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  formatTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  formatTabActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  formatTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  formatTabTextActive: {
    color: '#4F46E5',
    fontWeight: '800'
  },
  sizeConfig: {
    marginBottom: 24,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#374151',
    marginLeft: 10,
    fontWeight: '600'
  },
  sizeInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    width: 120,
    fontWeight: '600'
  },
  qrDisplayArea: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative'
  },
  qrShadowBox: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 12
  },
  targetCard: {
     marginTop: 20,
     backgroundColor: '#F3F4F6',
     padding: 12,
     borderRadius: 10
  },
  targetCardTitle: {
     fontSize: 12,
     fontWeight: '700',
     color: '#4B5563',
     marginBottom: 4,
     textTransform: 'uppercase'
  },
  qrValueText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18
  },
});
