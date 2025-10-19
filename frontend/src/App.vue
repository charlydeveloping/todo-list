<template>
  <div class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 text-gray-900">
    <div class="max-w-xl mx-auto bg-white shadow-sm rounded-lg p-6">
      <h1 class="text-2xl font-bold mb-4">To-Do List</h1>

      <form @submit.prevent="addTask" class="flex gap-2 mb-6">
        <input
          v-model="newTitle"
          type="text"
          placeholder="Nueva tarea..."
          class="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          :disabled="loading || newTitle.trim().length === 0"
        >
          Agregar
        </button>
      </form>

      <div v-if="error" class="mb-4 p-3 rounded bg-red-50 text-red-700">{{ error }}</div>

      <ul class="space-y-2">
        <li v-for="task in tasks" :key="task.id" class="flex items-center justify-between bg-gray-50 rounded p-3 border border-gray-200">
          <label class="flex items-center gap-3">
            <input type="checkbox" :checked="task.completed" @change="toggleTask(task)" />
            <span :class="{ 'line-through text-gray-400': task.completed }">{{ task.title }}</span>
            <span class="text-xs text-gray-400">{{ formatDate(task.created_at) }}</span>
          </label>
          <button @click="deleteTask(task)" class="text-red-600 hover:text-red-700">Eliminar</button>
        </li>
      </ul>

      <div v-if="tasks.length === 0 && !loading" class="text-gray-500 text-center mt-6">No hay tareas aún.</div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const tasks = ref([]);
const newTitle = ref('');
const loading = ref(false);
const error = ref('');

function formatDate(d) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return '';
  }
}

async function fetchTasks() {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await axios.get(`${API}/tasks`);
    tasks.value = data;
  } catch (e) {
    error.value = 'No se pudo cargar las tareas.';
  } finally {
    loading.value = false;
  }
}

async function addTask() {
  if (!newTitle.value.trim()) return;
  loading.value = true;
  error.value = '';
  try {
    const { data } = await axios.post(`${API}/tasks`, { title: newTitle.value.trim() });
    tasks.value.unshift(data);
    newTitle.value = '';
  } catch (e) {
    error.value = 'No se pudo agregar la tarea.';
  } finally {
    loading.value = false;
  }
}

async function toggleTask(task) {
  try {
    const { data } = await axios.patch(`${API}/tasks/${task.id}`, { completed: !task.completed });
    const idx = tasks.value.findIndex(t => t.id === task.id);
    if (idx !== -1) tasks.value[idx] = data;
  } catch (e) {
    error.value = 'No se pudo actualizar la tarea.';
  }
}

async function deleteTask(task) {
  try {
    await axios.delete(`${API}/tasks/${task.id}`);
    tasks.value = tasks.value.filter(t => t.id !== task.id);
  } catch (e) {
    error.value = 'No se pudo eliminar la tarea.';
  }
}

onMounted(fetchTasks);
</script>

<style>
/**** Additional component styles if needed ****/
</style>
