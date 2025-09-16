import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

type Expense = {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
};

const categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Others'];

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getLastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(formatDate(d));
  }
  return days;
}

export default function ExpenseTrackerPathway() {
  const days = getLastNDays(30);

  const [expensesByDate, setExpensesByDate] = useState<Record<string, Expense[]>>({});
  const [activeDate, setActiveDate] = useState(days[days.length - 1]);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);

  const addExpense = () => {
    if (!description || !amount || isNaN(Number(amount))) {
      Alert.alert('Please enter valid description and amount');
      return;
    }

    const newExpense: Expense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category,
      date: activeDate,
    };

    setExpensesByDate((prev) => {
      const prevExpenses = prev[activeDate] || [];
      return { ...prev, [activeDate]: [...prevExpenses, newExpense] };
    });

    // Clear inputs
    setDescription('');
    setAmount('');
    setCategory(categories[0]);
  };

  const todaysExpenses = expensesByDate[activeDate] || [];
  const totalForDay = todaysExpenses.reduce((acc, e) => acc + e.amount, 0);

  // Calculate net total (all expenses over all days)
  const netTotal = Object.values(expensesByDate)
    .flat()
    .reduce((acc, expense) => acc + expense.amount, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Tracker</Text>

      {/* Days pathway */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
        {days.map((day) => {
          const hasExpense = expensesByDate[day]?.length > 0;
          const isActive = day === activeDate;
          return (
            <TouchableOpacity
              key={day}
              onPress={() => setActiveDate(day)}
              style={[
                styles.dayCircle,
                isActive && styles.activeDayCircle,
                hasExpense && styles.filledDayCircle,
              ]}
            >
              <Text style={[styles.dayText, isActive && styles.activeDayText]}>
                {day.slice(8)}{/* show day of month */}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={styles.selectedDateText}>Selected Date: {activeDate}</Text>

      {/* Expense input */}
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Amount"
        value={amount}
        keyboardType="numeric"
        onChangeText={setAmount}
        style={styles.input}
      />

      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setCategory(cat)}
            style={[styles.categoryButton, category === cat && styles.selectedCategory]}
          >
            <Text style={category === cat ? styles.selectedCategoryText : styles.categoryText}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={addExpense} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Expense</Text>
      </TouchableOpacity>

      {/* Expenses List */}
      <Text style={styles.subtitle}>Expenses for {activeDate} (Total: Rs. {totalForDay.toFixed(2)})</Text>

      {todaysExpenses.length === 0 ? (
        <Text style={styles.noExpenseText}>No expenses added</Text>
      ) : (
        <FlatList
          data={todaysExpenses}
          keyExtractor={(item) => item.id.toString()}
          style={styles.expenseList}
          renderItem={({ item }) => (
            <View style={styles.expenseItem}>
              <Text style={styles.expenseDesc}>{item.description}</Text>
              <Text style={styles.expenseAmount}>Rs. {item.amount.toFixed(2)}</Text>
              <Text style={styles.expenseCategory}>{item.category}</Text>
            </View>
          )}
        />
      )}

      {/* Net total expense */}
      <Text style={styles.netTotalText}>Net Total Expense: Rs. {netTotal.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40, backgroundColor: '#f5f6fa' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center' },

  dayScroll: {
    maxHeight: 60,
    marginBottom: 15,
  },
  dayCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#dcdde1',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  filledDayCircle: {
    backgroundColor: '#7ed6df',
    borderColor: '#44bd32',
  },
  activeDayCircle: {
    borderColor: '#0097e6',
    borderWidth: 3,
  },
  dayText: {
    fontSize: 16,
    color: '#686de0',
  },
  activeDayText: {
    color: '#130f40',
    fontWeight: 'bold',
  },
  selectedDateText: {
    fontSize: 16,
    marginBottom: 10,
    alignSelf: 'center',
    fontWeight: '500',
  },

  input: {
    backgroundColor: 'white',
    height: 40,
    marginBottom: 15,
    fontSize: 16,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dcdde1',
  },

  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  categoryButton: {
    backgroundColor: '#dcdde1',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 6,
  },
  selectedCategory: {
    backgroundColor: '#130f40',
  },
  categoryText: {
    color: '#130f40',
    fontWeight: '600',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },

  addButton: {
    backgroundColor: '#130f40',
    borderRadius: 6,
    paddingVertical: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },

  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },

  noExpenseText: {
    fontStyle: 'italic',
    color: '#718093',
  },

  expenseList: {
    maxHeight: 200,
  },

  expenseItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 6,
    padding: 10,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  expenseDesc: {
    fontWeight: '600',
    flex: 1,
  },
  expenseAmount: {
    fontWeight: 'bold',
    color: '#0097e6',
    marginHorizontal: 8,
  },
  expenseCategory: {
    color: '#718093',
  },

  netTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'center',
    color: '#e84118',
  },
});
