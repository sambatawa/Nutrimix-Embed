'use client';
import React, { useEffect, useRef } from 'react';
import { Laptop, BarChart, Check, Egg, Rocket } from 'lucide-react';

const Progress = () => {
  const timelineRef = useRef(null);
  const steps = [
    {
      icon: Laptop,
      title: '1. Pemilihan Formula',
      description: 'Pilih Formula Pelet Nutrimix (1-6) pada dashboard kami',
      theme: 'from-[#D4A574] to-[#E8B98B]',
      cardGradient: 'from-[#F5E6D3]/80 to-[#F0DCC8]/80'
    },
    {
      icon: BarChart,
      title: '2. Penimbangan Bahan Baku',
      description: 'Sistem mengaktifkan penimbangan bahan baku. LCD memandu input bahan "Masukkan...", dan visualisasi tangki terisi real-time.',
      theme: 'from-[#C19A6B] to-[#D4A574]',
      cardGradient: 'from-[#F0DCC8]/80 to-[#E8D4C0]/80'
    },
    {
      icon: Check,
      title: '3. Verifikasi Bahan',
      description: 'Target berat tercapai. Sistem mengkonfirmasi "Berat Bahan Terpenuhi", lalu tangki visualisasi otomatis kosong.',
      theme: 'from-[#A67C52] to-[#C19A6B]',
      cardGradient: 'from-[#E8D4C0]/80 to-[#E0CCB8]/80'
    },
    {
      icon: Egg,
      title: '4. Proses penggilingan',
      description: 'Bahan terpenuhi, sistem menampilkan "Proses Menggiling!" (Tombol Darurat aktif).',
      theme: 'from-[#8B5A2B] to-[#A67C52]',
      cardGradient: 'from-[#E0CCB8]/80 to-[#D8C4B0]/80'
    },
    {
      icon: Rocket,
      title: '5. Selesai',
      description: 'Selesai, LCD menampilkan "Selesai" dan kembali ke Menu.',
      theme: 'from-[#6F4E37] to-[#8B5A2B]',
      cardGradient: 'from-[#D8C4B0]/80 to-[#D0BCA8]/80'
    },
  ];

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const timelineLine = timeline.querySelector('.timeline-line');
    const timelineItems = timeline.querySelectorAll('.timeline-item');

    const handleScroll = () => {
      const timelineRect = timeline.getBoundingClientRect();
      const timelineStart = timelineRect.top + window.scrollY;
      const timelineEnd = timelineRect.bottom + window.scrollY;
      const scrollPosition = window.scrollY + window.innerHeight * 0.8;

      const progress = Math.min(1, Math.max(0, (scrollPosition - timelineStart) / (timelineEnd - timelineStart)));
      timelineLine.style.height = `${progress * 100}%`;

      timelineItems.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const itemPosition = itemRect.top + window.scrollY;
        if (scrollPosition > itemPosition) {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return React.createElement(
    'div',
    {
      className: 'min-h-screen bg-gradient-to-br from-[#F5E6D3] via-[#F0DCC8] to-[#E8D4C0] py-16 px-4 md:px-8'
    },
    React.createElement(
      'div',
      {
        className: 'max-w-6xl mx-auto'
      },
      React.createElement(
        'h2',
        {
          className: 'mb-16 text-center',
          style: { 
            fontSize: '3rem', 
            lineHeight: '1.1', 
            fontWeight: '500',
            background: 'linear-gradient(90deg, #8B5A2B 0%, #C19A6B 50%, #D4A574 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.025em'
          }
        },
        'Bagaimana Nutrimix bekerja?'
      ),
      React.createElement(
        'div',
        {
          ref: timelineRef,
          className: 'relative'
        },
        React.createElement('div', {
          className: 'timeline-line absolute left-1/2 top-0 h-0 w-1 bg-gradient-to-b from-[#D4A574] via-[#C19A6B] to-[#8B5A2B] transform -translate-x-1/2 transition-all duration-1000 ease-out'
        }),
        React.createElement(
          'div',
          { className: 'space-y-16' },
          steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;
            
            return React.createElement(
              'div',
              {
                key: index,
                className: `timeline-item relative flex ${isEven ? 'justify-start' : 'justify-end'} items-center w-full opacity-0 transition-all duration-700 ease-out transform translate-y-8`
              },
              React.createElement(
                'div',
                {
                  className: `w-full md:w-[45%] p-7 rounded-2xl backdrop-blur-lg border border-white/30 shadow-lg ${
                    isEven ? 'md:mr-auto' : 'md:ml-auto'
                  } hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${step.cardGradient}`
                },
                React.createElement(
                  'div',
                  {
                    className: `absolute -top-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                      isEven ? 'md:-left-6' : 'md:-right-6'
                    } bg-gradient-to-br ${step.theme} backdrop-blur-md`
                  },
                  React.createElement(Icon, {
                    className: 'w-5 h-5 text-white',
                    size: 20
                  })
                ),
                React.createElement(
                  'div',
                  { className: 'mt-1' },
                  React.createElement(
                    'h3',
                    {
                      className: 'text-xl font-bold mb-3 bg-gradient-to-r from-[#6F4E37] to-[#8B5A2B] bg-clip-text text-transparent'
                    },
                    step.title
                  ),
                  React.createElement(
                    'p',
                    {
                      className: 'text-[#5D4A3C] leading-relaxed text-justify'
                    },
                    step.description
                  )
                )
              )
            );
          })
        )
      )
    )
  );
};

export { Progress };