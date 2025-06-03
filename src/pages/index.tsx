import { type ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import FloatingElements from '../components/FloatingElements';
import Hero from '../components/Hero';
import Features from '../components/Features';
import CodeExamples from '../components/CodeExamples';
import Documentation from '../components/Documentation';
import Footer from '../components/Footer';

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-all duration-500 overflow-x-hidden">
        <FloatingElements />
        <Hero />
        <Features />
        <CodeExamples />
        <Documentation />
        <Footer />
      </main>
    </Layout>
  );
}
