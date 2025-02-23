import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stem_kit_backend.settings')
django.setup()

from accounts.models import User
from products.models import Product, Lab
from orders.models import Order, OrderItem
from support.models import SupportTicket, SupportMessage

def create_sample_data():
    # Create sample products
    products = [
        {
            'name': 'Arduino Starter Kit',
            'description': 'Complete starter kit for learning Arduino programming and electronics. Includes Arduino UNO board, breadboard, components, and detailed tutorials.',
            'price': Decimal('49.99'),
            'stock': 50,
        },
        {
            'name': 'Raspberry Pi 4 Kit',
            'description': 'Complete Raspberry Pi 4 kit with case, power supply, and SD card. Perfect for learning programming, electronics, and building IoT projects.',
            'price': Decimal('89.99'),
            'stock': 30,
        },
        {
            'name': 'Electronics Learning Kit',
            'description': 'Basic electronics components and learning materials. Includes resistors, capacitors, LEDs, and project guide for beginners.',
            'price': Decimal('29.99'),
            'stock': 100,
        },
        {
            'name': 'Robot Building Kit',
            'description': 'Build your own robot with this comprehensive kit. Includes motors, sensors, controller board, and step-by-step instructions.',
            'price': Decimal('79.99'),
            'stock': 40,
        },
        {
            'name': 'Sensors Pack',
            'description': 'Collection of various sensors for electronics projects. Includes temperature, humidity, motion, and light sensors.',
            'price': Decimal('39.99'),
            'stock': 60,
        },
        {
            'name': 'AI Learning Kit',
            'description': 'Complete kit for learning Artificial Intelligence and Machine Learning. Includes Nvidia Jetson Nano, camera module, sensors, and comprehensive AI/ML tutorials.',
            'price': Decimal('199.99'),
            'stock': 25,
        },
        {
            'name': 'IoT Smart Home Kit',
            'description': 'Build your own smart home system. Includes ESP32 board, various sensors (temperature, humidity, motion), actuators, relays, and WiFi connectivity modules.',
            'price': Decimal('129.99'),
            'stock': 35,
        },
        {
            'name': 'Drone Building Kit',
            'description': 'Complete DIY drone building kit. Includes frame, motors, ESCs, flight controller, propellers, and battery. Perfect for learning about aerodynamics and flight control.',
            'price': Decimal('249.99'),
            'stock': 20,
        },
        {
            'name': '3D Printer Learning Kit',
            'description': 'Learn 3D printing technology hands-on. Includes basic 3D printer components, filaments, tools, and comprehensive guide for assembly and calibration.',
            'price': Decimal('299.99'),
            'stock': 15,
        }
    ]

    for product_data in products:
        product = Product.objects.create(**product_data)
        print(f'Created product: {product.name}')

        # Create labs for each product
        labs = []
        
        if product.name == 'AI Learning Kit':
            labs = [
                {
                    'title': 'Introduction to AI and Machine Learning',
                    'description': 'Learn the basics of AI and ML concepts',
                    'content': 'Understanding AI/ML fundamentals, setting up Jetson Nano, and basic image recognition...',
                    'status': 'published',
                },
                {
                    'title': 'Computer Vision Projects',
                    'description': 'Build computer vision applications',
                    'content': 'Object detection, face recognition, and gesture control projects...',
                    'status': 'published',
                },
                {
                    'title': 'Deep Learning Applications',
                    'description': 'Advanced AI projects using deep learning',
                    'content': 'Neural networks, TensorFlow projects, and real-time AI applications...',
                    'status': 'published',
                }
            ]
        elif product.name == 'IoT Smart Home Kit':
            labs = [
                {
                    'title': 'Smart Home Basics',
                    'description': 'Introduction to IoT and smart home concepts',
                    'content': 'Setting up ESP32, connecting sensors, and basic automation...',
                    'status': 'published',
                },
                {
                    'title': 'Home Automation Projects',
                    'description': 'Build automated home systems',
                    'content': 'Temperature control, lighting automation, and security systems...',
                    'status': 'published',
                },
                {
                    'title': 'IoT Cloud Integration',
                    'description': 'Connect your smart home to the cloud',
                    'content': 'Cloud platforms, remote monitoring, and control applications...',
                    'status': 'published',
                }
            ]
        elif product.name == 'Drone Building Kit':
            labs = [
                {
                    'title': 'Drone Assembly Basics',
                    'description': 'Learn how to assemble your drone',
                    'content': 'Frame assembly, motor installation, and electronic connections...',
                    'status': 'published',
                },
                {
                    'title': 'Flight Controller Setup',
                    'description': 'Configure and calibrate flight controls',
                    'content': 'Flight controller programming, calibration, and testing...',
                    'status': 'published',
                },
                {
                    'title': 'Advanced Flight Features',
                    'description': 'Learn advanced drone flying techniques',
                    'content': 'GPS modes, autonomous flight, and camera control...',
                    'status': 'published',
                }
            ]
        elif product.name == '3D Printer Learning Kit':
            labs = [
                {
                    'title': '3D Printer Assembly',
                    'description': 'Build your own 3D printer',
                    'content': 'Step-by-step assembly guide, component installation...',
                    'status': 'published',
                },
                {
                    'title': 'Calibration and First Prints',
                    'description': 'Learn to calibrate and start printing',
                    'content': 'Bed leveling, temperature settings, and basic prints...',
                    'status': 'published',
                },
                {
                    'title': 'Advanced 3D Printing',
                    'description': 'Master advanced printing techniques',
                    'content': 'Custom materials, complex models, and print optimization...',
                    'status': 'published',
                }
            ]
        elif product.name == 'Arduino Starter Kit':
            labs = [
                {
                    'title': 'Getting Started with Arduino',
                    'description': 'Introduction to Arduino programming and hardware',
                    'content': 'Learn about Arduino board components, IDE setup, and basic programming concepts...',
                    'status': 'published',
                },
                {
                    'title': 'Basic Electronics with Arduino',
                    'description': 'Learn fundamental electronics concepts',
                    'content': 'Understanding LEDs, resistors, breadboard connections, and basic circuits...',
                    'status': 'published',
                },
                {
                    'title': 'Arduino Sensors and Actuators',
                    'description': 'Working with various sensors and outputs',
                    'content': 'Projects with temperature sensors, servo motors, and LCD displays...',
                    'status': 'published',
                }
            ]
        elif product.name == 'Raspberry Pi 4 Kit':
            labs = [
                {
                    'title': 'Raspberry Pi Setup and Linux Basics',
                    'description': 'Getting started with Raspberry Pi',
                    'content': 'OS installation, basic Linux commands, and initial configuration...',
                    'status': 'published',
                },
                {
                    'title': 'Python Programming on Raspberry Pi',
                    'description': 'Learn Python programming with hands-on projects',
                    'content': 'Basic Python concepts, GPIO programming, and simple automation projects...',
                    'status': 'published',
                },
                {
                    'title': 'Building IoT Projects',
                    'description': 'Create Internet of Things projects',
                    'content': 'Web servers, sensor data collection, and cloud connectivity...',
                    'status': 'published',
                }
            ]
        elif product.name == 'Electronics Learning Kit':
            labs = [
                {
                    'title': 'Basic Electronics Theory',
                    'description': 'Understanding fundamental electronics concepts',
                    'content': 'Voltage, current, resistance, and Ohm\'s law with practical examples...',
                    'status': 'published',
                },
                {
                    'title': 'Circuit Building Basics',
                    'description': 'Learn to build and test circuits',
                    'content': 'Reading schematics, breadboard prototyping, and basic troubleshooting...',
                    'status': 'published',
                },
                {
                    'title': 'Digital Electronics Projects',
                    'description': 'Hands-on digital electronics experiments',
                    'content': 'Logic gates, flip-flops, and basic digital circuits...',
                    'status': 'published',
                }
            ]
        elif product.name == 'Robot Building Kit':
            labs = [
                {
                    'title': 'Robot Assembly Guide',
                    'description': 'Step-by-step robot construction',
                    'content': 'Mechanical assembly, motor connections, and chassis building...',
                    'status': 'published',
                },
                {
                    'title': 'Robot Programming Basics',
                    'description': 'Learn to program your robot',
                    'content': 'Motor control, sensor integration, and basic movement algorithms...',
                    'status': 'published',
                },
                {
                    'title': 'Advanced Robot Features',
                    'description': 'Add advanced capabilities to your robot',
                    'content': 'Line following, obstacle avoidance, and autonomous navigation...',
                    'status': 'published',
                }
            ]
        elif product.name == 'Sensors Pack':
            labs = [
                {
                    'title': 'Introduction to Sensors',
                    'description': 'Understanding different types of sensors',
                    'content': 'Sensor basics, working principles, and connection methods...',
                    'status': 'published',
                },
                {
                    'title': 'Environmental Monitoring',
                    'description': 'Build environmental monitoring projects',
                    'content': 'Temperature and humidity monitoring, data logging, and visualization...',
                    'status': 'published',
                },
                {
                    'title': 'Sensor Integration Projects',
                    'description': 'Combine multiple sensors in projects',
                    'content': 'Building a weather station, motion detection system, and smart garden...',
                    'status': 'published',
                }
            ]

        for lab_data in labs:
            lab_data['product'] = product
            lab = Lab.objects.create(**lab_data)
            print(f'Created lab: {lab.title}')

    print('Sample data created successfully!')

if __name__ == '__main__':
    create_sample_data() 