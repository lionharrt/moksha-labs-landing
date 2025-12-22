<template>
  <BaseSection theme-color="#1A1A1A" id="contact">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">
      <div>
        <h2 class="text-7xl font-bold mb-8 leading-tight">Ready to <span class="text-saffron italic">Ascend?</span></h2>
        <p class="text-cream/60 text-xl max-w-md mb-12">Let's discuss how we can elevate your digital presence to new heights.</p>
        
        <div class="space-y-6">
          <a href="mailto:hello@mokshalabs.com" class="block text-3xl font-serif hover:text-saffron transition-colors">hello@mokshalabs.com</a>
          <p class="text-cream/40 uppercase tracking-widest text-sm">San Francisco — Global</p>
        </div>
      </div>

      <div class="glass-panel p-10 border-cream/10">
        <form @submit.prevent class="space-y-6">
          <div class="space-y-2">
            <label class="text-xs uppercase tracking-widest font-bold opacity-50">Name</label>
            <input type="text" class="w-full bg-transparent border-b border-cream/20 py-3 focus:outline-none focus:border-saffron transition-colors" />
          </div>
          <div class="space-y-2">
            <label class="text-xs uppercase tracking-widest font-bold opacity-50">Email</label>
            <input type="email" class="w-full bg-transparent border-b border-cream/20 py-3 focus:outline-none focus:border-saffron transition-colors" />
          </div>
          <div class="space-y-2">
            <label class="text-xs uppercase tracking-widest font-bold opacity-50">Message</label>
            <textarea rows="4" class="w-full bg-transparent border-b border-cream/20 py-3 focus:outline-none focus:border-saffron transition-colors resize-none"></textarea>
          </div>
          <button class="bg-saffron text-charcoal font-bold py-4 px-10 rounded-full hover:bg-cream transition-colors mt-4">
            Send Inquiry
          </button>
        </form>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
// No extra logic for now
</script>

