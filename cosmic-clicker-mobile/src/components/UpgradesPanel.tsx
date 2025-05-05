import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, Dimensions, Animated, Pressable } from 'react-native';
import { useGame } from '@/src/context/GameContext';

const TABS = [
  { id: 'click', icon: require('@/assets/icons/clicker.png'), label: 'Click Power' },
  { id: 'passive', icon: require('@/assets/icons/star.png'), label: 'Passive Income' },
  { id: 'event', icon: require('@/assets/icons/rocket.png'), label: 'Event Chance' },
  { id: 'meta', icon: require('@/assets/icons/nebula.png'), label: 'Meta Upgrades' },
];

const BULK_OPTIONS = [1, 5, 10, 25];
const SCREEN_HEIGHT = Dimensions.get('window').height;

interface UpgradesPanelProps {
  visible: boolean;
  onClose: () => void;
  asBottomSheet?: boolean;
}

const UpgradesPanel: React.FC<UpgradesPanelProps> = ({ visible, onClose, asBottomSheet }) => {
  const { state, dispatch } = useGame();
  const [activeTab, setActiveTab] = useState('click');
  const [bulkAmount, setBulkAmount] = useState(1);
  const metaUpgrades = Object.values(state.metaUpgrades);
  const upgrades = Object.values(state.upgrades).filter(u => u.type === activeTab);

  // Unlock conditions (mocked for now)
  const UNLOCK_CONDITIONS: Record<string, (state: any) => boolean> = {
    prestige1: (s) => s.prestigeCount >= 1,
    prestige10: (s) => s.prestigeCount >= 10,
  };

  // Animation for bottom sheet
  const [sheetAnim] = useState(new Animated.Value(0));
  React.useEffect(() => {
    if (asBottomSheet) {
      Animated.timing(sheetAnim, {
        toValue: visible ? 1 : 0,
        duration: 260,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, asBottomSheet, sheetAnim]);

  if (!visible) return null;

  // Bottom sheet style
  if (asBottomSheet) {
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <Pressable style={styles.overlay} onPress={onClose} />
        <Animated.View
          style={[
            styles.bottomSheetFull,
            {
              transform: [
                {
                  translateY: sheetAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [SCREEN_HEIGHT, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.dragHandleWrap}>
            <View style={styles.dragHandle} />
          </View>
          <View style={styles.panel}>
            <View style={styles.header}>
              <Text style={styles.title}>Upgrades</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close upgrades panel">
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tabsRow}>
              {TABS.map(tab => (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.tabBtn, activeTab === tab.id && styles.tabBtnActive]}
                  onPress={() => setActiveTab(tab.id)}
                  accessibilityLabel={tab.label}
                >
                  <Image source={tab.icon} style={styles.tabIcon} />
                  <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>{tab.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {activeTab !== 'meta' && (
              <View style={styles.bulkRow}>
                <Text style={styles.bulkLabel}>Bulk Buy:</Text>
                {BULK_OPTIONS.map(amount => (
                  <TouchableOpacity
                    key={amount}
                    style={[styles.bulkBtn, bulkAmount === amount && styles.bulkBtnActive]}
                    onPress={() => setBulkAmount(amount)}
                  >
                    <Text style={bulkAmount === amount ? styles.bulkBtnTextActive : styles.bulkBtnText}>{amount}x</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={styles.content}>
              {activeTab === 'meta' ? (
                metaUpgrades.length === 0 ? (
                  <Text style={{ color: '#b3b3ff', textAlign: 'center', marginTop: 32 }}>
                    No meta-upgrades available.
                  </Text>
                ) : (
                  <FlatList
                    data={metaUpgrades}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {
                      const cond = UNLOCK_CONDITIONS[item.unlockCondition];
                      const unlocked = cond ? cond(state) : true;
                      let unlockText = '';
                      if (item.unlockCondition === 'prestige1') unlockText = 'Unlocks at 1 Prestige';
                      else if (item.unlockCondition === 'prestige10') unlockText = 'Unlocks at 10 Prestiges';
                      else unlockText = 'Unlocks by milestone';
                      const cost = Math.floor(item.baseCost * Math.pow(item.costMultiplier, item.level));
                      const canAfford = unlocked && state.prestigeCurrency >= cost && (!item.maxLevel || item.level < item.maxLevel);
                      return (
                        <View style={styles.metaRow}>
                          <Image source={require('@/assets/icons/nebula.png')} style={styles.metaIcon} />
                          <View style={{ flex: 1, marginLeft: 8 }}>
                            <Text style={styles.metaName}>{item.name} <Text style={styles.metaLevel}>Lv {item.level}{item.maxLevel ? `/${item.maxLevel}` : ''}</Text></Text>
                            <Text style={styles.metaDesc}>{item.description}</Text>
                            {!unlocked && <Text style={styles.metaUnlock}>{unlockText}</Text>}
                          </View>
                          <View style={{ alignItems: 'flex-end' }}>
                            <View style={styles.metaCostRow}>
                              <Text style={[styles.metaCost, { color: canAfford ? '#facc15' : '#b3b3ff' }]}>{cost}</Text>
                              <Image source={require('@/assets/icons/prestige.png')} style={styles.metaPrestigeIcon} />
                            </View>
                            <TouchableOpacity
                              style={[styles.metaButton, (!canAfford || !unlocked) && styles.metaButtonDisabled]}
                              disabled={!canAfford || !unlocked}
                            >
                              <Text style={{ color: !canAfford || !unlocked ? '#aaa' : '#fff', fontWeight: 'bold' }}>Purchase</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    }}
                    style={{ width: '100%' }}
                    contentContainerStyle={{ paddingBottom: 12 }}
                  />
                )
              ) : (
                upgrades.length === 0 ? (
                  <Text style={{ color: '#b3b3ff', textAlign: 'center', marginTop: 32 }}>
                    No upgrades available.
                  </Text>
                ) : (
                  <FlatList
                    data={upgrades}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {
                      const cost = Math.floor(item.baseCost * Math.pow(item.costMultiplier, item.level));
                      return (
                        <View style={styles.upgradeRow}>
                          <Image source={item.type === 'click' ? require('@/assets/icons/clicker.png') : require('@/assets/icons/star.png')} style={styles.upgradeIcon} />
                          <View style={{ flex: 1, marginLeft: 8 }}>
                            <Text style={styles.upgradeName}>{item.name} (Lv {item.level})</Text>
                            <Text style={styles.upgradeDesc}>{item.description}</Text>
                            <Text style={styles.upgradeCost}>Cost: <Text style={{ color: '#facc15' }}>{cost}</Text></Text>
                          </View>
                          <TouchableOpacity
                            style={[styles.upgradeButton, state.stardust < cost && styles.upgradeButtonDisabled]}
                            onPress={() => dispatch({ type: 'BUY_UPGRADE', upgradeId: item.id, bulkAmount })}
                            disabled={state.stardust < cost}
                            accessibilityLabel={`Buy ${item.name} upgrade`}
                          >
                            <Text style={{ color: state.stardust < cost ? '#aaa' : '#fff', fontWeight: 'bold' }}>Buy</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                    style={{ width: '100%' }}
                    contentContainerStyle={{ paddingBottom: 12 }}
                  />
                )
              )}
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }

  // Fallback to modal for non-bottom-sheet usage
  return null;
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 16, 48, 0.85)',
    zIndex: 10,
  },
  bottomSheetFull: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    paddingBottom: 0,
    width: '100%',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  dragHandleWrap: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 2,
  },
  dragHandle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#b3b3ff',
    opacity: 0.25,
  },
  panel: {
    width: '92%',
    maxWidth: 420,
    backgroundColor: 'rgba(49, 46, 129, 0.95)',
    borderRadius: 22,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(80, 80, 120, 0.25)',
  },
  closeText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 2,
  },
  tabBtn: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 2,
    backgroundColor: 'transparent',
  },
  tabBtnActive: {
    backgroundColor: 'rgba(109, 40, 217, 0.18)',
  },
  tabIcon: {
    width: 32,
    height: 32,
    marginBottom: 2,
  },
  tabLabel: {
    color: '#b3b3ff',
    fontSize: 12,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#fff',
  },
  bulkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 2,
    gap: 4,
  },
  bulkLabel: {
    color: '#b3b3ff',
    fontSize: 13,
    marginRight: 8,
  },
  bulkBtn: {
    backgroundColor: 'rgba(109, 40, 217, 0.10)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 2,
  },
  bulkBtnActive: {
    backgroundColor: '#6d28d9',
  },
  bulkBtnText: {
    color: '#b3b3ff',
    fontWeight: 'bold',
  },
  bulkBtnTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  upgradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 16, 48, 0.7)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  upgradeIcon: {
    width: 36,
    height: 36,
    marginRight: 2,
  },
  upgradeName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  upgradeDesc: {
    color: '#b3b3ff',
    fontSize: 12,
    marginBottom: 2,
  },
  upgradeCost: {
    color: '#facc15',
    fontSize: 13,
    marginTop: 2,
  },
  upgradeButton: {
    backgroundColor: '#4f8cff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginLeft: 10,
  },
  upgradeButtonDisabled: {
    backgroundColor: '#2d2d4d',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 16, 48, 0.8)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  metaIcon: {
    width: 38,
    height: 38,
    marginRight: 2,
  },
  metaName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  metaLevel: {
    color: '#a78bfa',
    fontSize: 13,
    fontWeight: '600',
  },
  metaDesc: {
    color: '#b3b3ff',
    fontSize: 12,
    marginBottom: 2,
  },
  metaUnlock: {
    color: '#facc15',
    fontSize: 12,
    marginTop: 2,
  },
  metaCostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaCost: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 4,
  },
  metaPrestigeIcon: {
    width: 20,
    height: 20,
    marginLeft: 1,
  },
  metaButton: {
    backgroundColor: '#6d28d9',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 16,
    marginLeft: 0,
  },
  metaButtonDisabled: {
    backgroundColor: '#2d2d4d',
  },
});

export default UpgradesPanel; 