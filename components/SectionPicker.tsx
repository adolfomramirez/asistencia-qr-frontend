import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/api';
import { getToken } from '../services/authService';

type Section = {
  id: number;
  name: string;
  course: { id: number; name: string; code: string };
};

type Props = {
  selectedSectionId: number | null;
  onSectionChange: (sectionId: number) => void;
};

export default function SectionPicker({ selectedSectionId, onSectionChange }: Props) {
  const [sections, setSections] = useState<Section[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [webSelectRef, setWebSelectRef] = useState<any>(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const tokenAuth = getToken();
        if (!tokenAuth) return;
        const { data } = await axios.get(`${API_URL}/users/me/sections`, {
          headers: { Authorization: `Bearer ${tokenAuth}` },
        });
        setSections(data);
      } catch (err) {
        // silently fail
      }
    };
    fetchSections();
  }, []);

  const selectedSection = sections.find(s => s.id === selectedSectionId);

  // ── WEB: native <select> ────────────────────────────────────────────────
  if (Platform.OS === 'web') {
    return React.createElement('select', {
      ref: setWebSelectRef,
      value: selectedSectionId ?? '',
      onChange: (e: any) => onSectionChange(Number(e.target.value)),
      style: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        padding: '12px 14px',
        fontSize: 15,
        color: selectedSectionId ? '#111827' : '#9CA3AF',
        width: '100%',
        fontFamily: 'inherit',
        appearance: 'none',
        cursor: 'pointer',
      },
    },
      [
        React.createElement('option', { key: 'placeholder', value: '' }, 'Selecciona un curso...'),
        ...sections.map(s =>
          React.createElement('option', { key: s.id, value: s.id }, `${s.course.name} — ${s.name}`)
        )
      ]
    );
  }

  // ── MOBILE: modal picker ────────────────────────────────────────────────
  return (
    <View>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setPickerVisible(true)}
      >
        <Text style={[
          styles.pickerButtonText,
          !selectedSection && styles.pickerPlaceholder,
        ]}>
          {selectedSection
            ? `${selectedSection.course.name} — ${selectedSection.name}`
            : 'Selecciona un curso...'}
        </Text>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>

      <Modal visible={pickerVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona un curso</Text>
            {sections.map(s => (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.option,
                  s.id === selectedSectionId && styles.optionSelected,
                ]}
                onPress={() => {
                  onSectionChange(s.id);
                  setPickerVisible(false);
                }}
              >
                <Text style={[
                  styles.optionText,
                  s.id === selectedSectionId && styles.optionTextSelected,
                ]}>
                  {s.course.name} — {s.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 15,
    color: '#111827',
  },
  pickerPlaceholder: {
    color: '#9CA3AF',
  },
  chevron: {
    fontSize: 12,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  option: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionSelected: {
    backgroundColor: '#E0E7FF',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  optionText: {
    fontSize: 15,
    color: '#374151',
  },
  optionTextSelected: {
    color: '#4F46E5',
    fontWeight: '700',
  },
});