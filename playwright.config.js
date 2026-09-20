import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./tests/ui',timeout:60000,use:{baseURL:process.env.TORCHFDTD_URL||'http://127.0.0.1:8765',viewport:{width:1560,height:980},headless:true},workers:1,reporter:'list'});
