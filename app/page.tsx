'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Layout, Calendar, ListTodo, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const features = [
    {
      icon: <ListTodo className="w-6 h-6" />,
      title: "Task Management",
      description: "Create, organize, and track your tasks with ease"
    },
    {
      icon: <Layout className="w-6 h-6" />,
      title: "Project Organization",
      description: "Group related tasks into projects for better organization"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Calendar Integration",
      description: "View and manage tasks in a calendar layout"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Priority Levels",
      description: "Set task priorities and stay focused on what matters"
    }
  ];

  return (
    <div className="min-h-screen">

      <motion.section
        className="mx-auto max-w-7xl text-center"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >

        <motion.div
          className="flex gap-4 justify-center"
          variants={fadeIn}
        >
          <nav className="flex w-full items-end gap-4 p-2 flex-row-reverse">
            <Link href={"/login"}><Button>Login</Button></Link>
            <Link href={"/register"}><Button className="bg-transparent border-2 border-gray-600 text-black hover:bg-gray-200 hover:border-gray-400">Signup</Button></Link>
          </nav>
        </motion.div>
      </motion.section>

      {/* Hero Section */}
      <motion.section
        className="px-4 md:py-32 mx-auto max-w-7xl text-center"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6"
          variants={fadeIn}
        >
          Manage Tasks,{" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Achieve More
          </span>
        </motion.h1>
        <motion.p
          className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          variants={fadeIn}
        >
          Your personal task management system for increased productivity and better organization.
        </motion.p>
        <motion.div
          className="flex gap-4 justify-center"
          variants={fadeIn}
        >
          <Link href="/login">
            <Button className="gap-2">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 bg-gray-50"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Take control of your tasks and boost your productivity today.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Task Management System. All rights reserved.</p>
          <Link href={"https://github.com/1447bits"}><p>Github @1447bits</p></Link>
        </div>
      </footer>
    </div>
  );
}