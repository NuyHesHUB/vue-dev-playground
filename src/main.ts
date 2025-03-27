import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css'
import App from './App.vue'
import startConfigure from './configure/start.config';

console.log(import.meta.env.VITE_APP_ENV);
const app = createApp(App);

const initialApp = async () => {
    const pinia = createPinia();
    app.use(pinia);
    await startConfigure();
    app.mount('#app');
};


/* const initialApp = async () => {
    try {
        const pinia = createPinia();
        app.use(pinia);
        await startConfigure();
        app.mount('#app');
    } catch (error) {
        // 에러 처리
        console.error('Error during app initialization:', error);
    }
}; */

initialApp();