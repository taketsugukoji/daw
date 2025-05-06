<script setup lang="ts"></script>

<template>
  <div class="app-container">
    <aside class="sidebar">
      <nav>
        <router-link to="/">プロジェクト</router-link>
        <router-link to="/list">保存した曲一覧</router-link>
      </nav>
    </aside>
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  padding: 20px;
  border-right: 1px solid #ddd;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar a {
  text-decoration: none;
  color: #333;
  padding: 8px 12px;
}

.sidebar a:hover {
  background-color: #e0e0e0;
}

.sidebar a.router-link-active {
  background-color: darkorange;
  color: white;
}
</style>
