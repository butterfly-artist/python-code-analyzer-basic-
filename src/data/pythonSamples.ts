import { CodeSample } from '../types/analyzer';

export const PYTHON_SAMPLES: CodeSample[] = [
  {
    id: 'hello-world',
    title: 'Hello World',
    description: 'Basic Python program with print statement',
    code: `# Simple Hello World program
def main():
    print("Hello, World!")
    
if __name__ == "__main__":
    main()`,
    language: 'python',
    difficulty: 'beginner',
    concepts: ['functions', 'print', 'main guard']
  },
  {
    id: 'variables-types',
    title: 'Variables and Data Types',
    description: 'Demonstration of Python variable types and assignments',
    code: `# Variables and data types
name = "Alice"
age = 25
height = 5.6
is_student = True
hobbies = ["reading", "coding", "hiking"]
person_info = {"name": name, "age": age}

print(f"Name: {name}, Type: {type(name)}")
print(f"Age: {age}, Type: {type(age)}")
print(f"Height: {height}, Type: {type(height)}")
print(f"Is student: {is_student}, Type: {type(is_student)}")
print(f"Hobbies: {hobbies}")
print(f"Person info: {person_info}")`,
    language: 'python',
    difficulty: 'beginner',
    concepts: ['variables', 'data types', 'f-strings', 'lists', 'dictionaries']
  },
  {
    id: 'control-flow',
    title: 'Control Flow Statements',
    description: 'If-else statements and conditional logic',
    code: `# Control flow example
def check_grade(score):
    if score >= 90:
        grade = "A"
    elif score >= 80:
        grade = "B"
    elif score >= 70:
        grade = "C"
    elif score >= 60:
        grade = "D"
    else:
        grade = "F"
    
    return grade

# Test the function
scores = [95, 87, 73, 65, 45]
for score in scores:
    grade = check_grade(score)
    print(f"Score: {score}, Grade: {grade}")`,
    language: 'python',
    difficulty: 'beginner',
    concepts: ['functions', 'conditionals', 'loops', 'return values']
  },
  {
    id: 'loops-iteration',
    title: 'Loops and Iteration',
    description: 'Different types of loops in Python',
    code: `# Different loop types
numbers = [1, 2, 3, 4, 5]

# For loop with list
print("For loop with list:")
for num in numbers:
    print(f"Number: {num}")

# For loop with range
print("\\nFor loop with range:")
for i in range(5):
    print(f"Index: {i}")

# While loop
print("\\nWhile loop:")
count = 0
while count < 3:
    print(f"Count: {count}")
    count += 1

# Enumerate for index and value
print("\\nUsing enumerate:")
for index, value in enumerate(numbers):
    print(f"Index {index}: {value}")`,
    language: 'python',
    difficulty: 'beginner',
    concepts: ['for loops', 'while loops', 'range', 'enumerate', 'iteration']
  },
  {
    id: 'functions-parameters',
    title: 'Functions with Parameters',
    description: 'Function definition with different parameter types',
    code: `# Functions with different parameter types
def greet(name, greeting="Hello"):
    """Greet a person with a custom or default greeting."""
    return f"{greeting}, {name}!"

def calculate_area(length, width=None):
    """Calculate area of rectangle or square."""
    if width is None:
        # Square
        return length ** 2
    else:
        # Rectangle
        return length * width

def sum_numbers(*args):
    """Sum any number of arguments."""
    return sum(args)

def print_info(**kwargs):
    """Print key-value pairs."""
    for key, value in kwargs.items():
        print(f"{key}: {value}")

# Test functions
print(greet("Alice"))
print(greet("Bob", "Hi"))
print(f"Square area: {calculate_area(5)}")
print(f"Rectangle area: {calculate_area(4, 6)}")
print(f"Sum: {sum_numbers(1, 2, 3, 4, 5)}")
print_info(name="Charlie", age=30, city="New York")`,
    language: 'python',
    difficulty: 'intermediate',
    concepts: ['functions', 'default parameters', '*args', '**kwargs', 'docstrings']
  },
  {
    id: 'list-comprehensions',
    title: 'List Comprehensions',
    description: 'Efficient list creation using comprehensions',
    code: `# List comprehensions
numbers = range(1, 11)

# Basic list comprehension
squares = [x**2 for x in numbers]
print(f"Squares: {squares}")

# List comprehension with condition
even_squares = [x**2 for x in numbers if x % 2 == 0]
print(f"Even squares: {even_squares}")

# Nested list comprehension
matrix = [[i*j for j in range(1, 4)] for i in range(1, 4)]
print(f"Matrix: {matrix}")

# Dictionary comprehension
word_lengths = {"apple": 5, "banana": 6, "cherry": 6}
reversed_dict = {length: word for word, length in word_lengths.items()}
print(f"Reversed dict: {reversed_dict}")

# Set comprehension
unique_lengths = {len(word) for word in ["hello", "world", "python", "code"]}
print(f"Unique lengths: {unique_lengths}")`,
    language: 'python',
    difficulty: 'intermediate',
    concepts: ['list comprehensions', 'dictionary comprehensions', 'set comprehensions', 'nested comprehensions']
  },
  {
    id: 'exception-handling',
    title: 'Exception Handling',
    description: 'Try-except blocks and error handling',
    code: `# Exception handling
def divide_numbers(a, b):
    """Safely divide two numbers."""
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        print("Error: Cannot divide by zero!")
        return None
    except TypeError:
        print("Error: Invalid input types!")
        return None

def read_file(filename):
    """Read file with proper exception handling."""
    try:
        with open(filename, 'r') as file:
            content = file.read()
            return content
    except FileNotFoundError:
        print(f"Error: File '{filename}' not found!")
        return None
    except PermissionError:
        print(f"Error: Permission denied for '{filename}'!")
        return None
    finally:
        print("File operation completed.")

# Test exception handling
print(divide_numbers(10, 2))
print(divide_numbers(10, 0))
print(divide_numbers("10", 2))

# Custom exception
class CustomError(Exception):
    """Custom exception class."""
    pass

def validate_age(age):
    """Validate age with custom exception."""
    if age < 0:
        raise CustomError("Age cannot be negative!")
    if age > 150:
        raise CustomError("Age seems unrealistic!")
    return True

try:
    validate_age(-5)
except CustomError as e:
    print(f"Validation error: {e}")`,
    language: 'python',
    difficulty: 'intermediate',
    concepts: ['exception handling', 'try-except', 'finally', 'custom exceptions', 'file handling']
  },
  {
    id: 'classes-oop',
    title: 'Classes and Object-Oriented Programming',
    description: 'Class definition, inheritance, and OOP concepts',
    code: `# Object-oriented programming
class Animal:
    """Base class for animals."""
    
    def __init__(self, name, species):
        self.name = name
        self.species = species
        self._age = 0  # Protected attribute
    
    def make_sound(self):
        """Make a generic animal sound."""
        return "Some generic animal sound"
    
    def get_info(self):
        """Get animal information."""
        return f"{self.name} is a {self.species}"
    
    @property
    def age(self):
        """Get age property."""
        return self._age
    
    @age.setter
    def age(self, value):
        """Set age with validation."""
        if value >= 0:
            self._age = value
        else:
            raise ValueError("Age cannot be negative")

class Dog(Animal):
    """Dog class inheriting from Animal."""
    
    def __init__(self, name, breed):
        super().__init__(name, "Dog")
        self.breed = breed
    
    def make_sound(self):
        """Override make_sound method."""
        return "Woof!"
    
    def fetch(self):
        """Dog-specific method."""
        return f"{self.name} is fetching the ball!"

class Cat(Animal):
    """Cat class inheriting from Animal."""
    
    def __init__(self, name, color):
        super().__init__(name, "Cat")
        self.color = color
    
    def make_sound(self):
        """Override make_sound method."""
        return "Meow!"
    
    def climb(self):
        """Cat-specific method."""
        return f"{self.name} is climbing a tree!"

# Create instances
dog = Dog("Buddy", "Golden Retriever")
cat = Cat("Whiskers", "Orange")

# Test methods
print(dog.get_info())
print(f"Sound: {dog.make_sound()}")
print(dog.fetch())

print(cat.get_info())
print(f"Sound: {cat.make_sound()}")
print(cat.climb())

# Test property
dog.age = 3
print(f"{dog.name} is {dog.age} years old")`,
    language: 'python',
    difficulty: 'intermediate',
    concepts: ['classes', 'inheritance', 'polymorphism', 'properties', 'method overriding']
  },
  {
    id: 'file-operations',
    title: 'File Operations',
    description: 'Reading, writing, and manipulating files',
    code: `# File operations
import os
import json

def write_text_file(filename, content):
    """Write content to a text file."""
    try:
        with open(filename, 'w') as file:
            file.write(content)
        print(f"Successfully wrote to {filename}")
    except IOError as e:
        print(f"Error writing to file: {e}")

def read_text_file(filename):
    """Read content from a text file."""
    try:
        with open(filename, 'r') as file:
            content = file.read()
        return content
    except FileNotFoundError:
        print(f"File {filename} not found")
        return None

def append_to_file(filename, content):
    """Append content to a file."""
    try:
        with open(filename, 'a') as file:
            file.write(content)
        print(f"Successfully appended to {filename}")
    except IOError as e:
        print(f"Error appending to file: {e}")

def work_with_json(filename, data):
    """Write and read JSON data."""
    # Write JSON
    try:
        with open(filename, 'w') as file:
            json.dump(data, file, indent=2)
        print(f"JSON data written to {filename}")
    except IOError as e:
        print(f"Error writing JSON: {e}")
    
    # Read JSON
    try:
        with open(filename, 'r') as file:
            loaded_data = json.load(file)
        return loaded_data
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error reading JSON: {e}")
        return None

# Example usage
sample_text = "Hello, this is a sample text file.\\n"
write_text_file("sample.txt", sample_text)
content = read_text_file("sample.txt")
print(f"File content: {content}")

append_to_file("sample.txt", "This line was appended.\\n")

# JSON example
sample_data = {
    "name": "John Doe",
    "age": 30,
    "hobbies": ["reading", "swimming", "coding"]
}

loaded_data = work_with_json("data.json", sample_data)
print(f"Loaded JSON data: {loaded_data}")

# Clean up (optional)
try:
    os.remove("sample.txt")
    os.remove("data.json")
    print("Temporary files cleaned up")
except OSError:
    pass`,
    language: 'python',
    difficulty: 'intermediate',
    concepts: ['file I/O', 'context managers', 'JSON', 'exception handling', 'os module']
  },
  {
    id: 'decorators',
    title: 'Decorators',
    description: 'Function decorators and their applications',
    code: `# Decorators
import time
from functools import wraps

def timer(func):
    """Decorator to measure function execution time."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} took {end_time - start_time:.4f} seconds")
        return result
    return wrapper

def validate_types(*types):
    """Decorator to validate function argument types."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for i, (arg, expected_type) in enumerate(zip(args, types)):
                if not isinstance(arg, expected_type):
                    raise TypeError(f"Argument {i+1} must be {expected_type.__name__}")
            return func(*args, **kwargs)
        return wrapper
    return decorator

def cache(func):
    """Simple caching decorator."""
    cache_dict = {}
    
    @wraps(func)
    def wrapper(*args):
        if args in cache_dict:
            print(f"Cache hit for {args}")
            return cache_dict[args]
        
        result = func(*args)
        cache_dict[args] = result
        print(f"Cache miss for {args}, result cached")
        return result
    
    return wrapper

# Apply decorators
@timer
@validate_types(int, int)
def add_numbers(a, b):
    """Add two numbers with validation and timing."""
    time.sleep(0.1)  # Simulate some work
    return a + b

@cache
def fibonacci(n):
    """Calculate fibonacci number with caching."""
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Class decorator
def singleton(cls):
    """Decorator to make a class a singleton."""
    instances = {}
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

@singleton
class Database:
    """Singleton database class."""
    def __init__(self):
        self.connection = "Connected to database"
    
    def query(self, sql):
        return f"Executing: {sql}"

# Test decorators
try:
    result = add_numbers(5, 3)
    print(f"Result: {result}")
    
    # This will raise TypeError
    # add_numbers("5", 3)
except TypeError as e:
    print(f"Type error: {e}")

# Test caching
print(f"Fibonacci(10): {fibonacci(10)}")
print(f"Fibonacci(10): {fibonacci(10)}")  # Should hit cache

# Test singleton
db1 = Database()
db2 = Database()
print(f"Same instance: {db1 is db2}")`,
    language: 'python',
    difficulty: 'advanced',
    concepts: ['decorators', 'functools', 'caching', 'validation', 'singleton pattern']
  },
  {
    id: 'generators-iterators',
    title: 'Generators and Iterators',
    description: 'Creating and using generators and iterators',
    code: `# Generators and iterators
def fibonacci_generator(n):
    """Generate fibonacci sequence up to n terms."""
    a, b = 0, 1
    count = 0
    while count < n:
        yield a
        a, b = b, a + b
        count += 1

def read_large_file(filename):
    """Generator to read large file line by line."""
    try:
        with open(filename, 'r') as file:
            for line in file:
                yield line.strip()
    except FileNotFoundError:
        print(f"File {filename} not found")

class NumberRange:
    """Custom iterator class."""
    
    def __init__(self, start, end, step=1):
        self.start = start
        self.end = end
        self.step = step
        self.current = start
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.current >= self.end:
            raise StopIteration
        
        value = self.current
        self.current += self.step
        return value

def squares_generator(n):
    """Generator expression example."""
    return (x**2 for x in range(n))

def prime_generator():
    """Infinite generator for prime numbers."""
    def is_prime(num):
        if num < 2:
            return False
        for i in range(2, int(num**0.5) + 1):
            if num % i == 0:
                return False
        return True
    
    num = 2
    while True:
        if is_prime(num):
            yield num
        num += 1

# Test generators
print("Fibonacci sequence:")
for fib in fibonacci_generator(10):
    print(fib, end=" ")
print()

print("\\nCustom iterator:")
for num in NumberRange(0, 10, 2):
    print(num, end=" ")
print()

print("\\nSquares generator:")
squares = squares_generator(5)
for square in squares:
    print(square, end=" ")
print()

print("\\nFirst 10 prime numbers:")
primes = prime_generator()
for _ in range(10):
    print(next(primes), end=" ")
print()

# Generator expressions
print("\\nEven numbers from 0 to 20:")
evens = (x for x in range(21) if x % 2 == 0)
print(list(evens))

# Memory efficient processing
def process_data(data_generator):
    """Process data from generator efficiently."""
    total = 0
    count = 0
    for item in data_generator:
        total += item
        count += 1
    return total / count if count > 0 else 0

# Create a generator for large dataset simulation
large_dataset = (x**2 for x in range(1000000))
# This won't consume much memory as it's a generator
print(f"\\nAverage of first 1000 squares: {process_data((x**2 for x in range(1000)))}")`,
    language: 'python',
    difficulty: 'advanced',
    concepts: ['generators', 'iterators', 'yield', 'generator expressions', 'memory efficiency']
  },
  {
    id: 'context-managers',
    title: 'Context Managers',
    description: 'Creating and using context managers',
    code: `# Context managers
import contextlib
import time
import sqlite3

class Timer:
    """Context manager for timing code execution."""
    
    def __init__(self, description="Operation"):
        self.description = description
    
    def __enter__(self):
        self.start_time = time.time()
        print(f"Starting {self.description}...")
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        end_time = time.time()
        elapsed = end_time - self.start_time
        print(f"{self.description} completed in {elapsed:.4f} seconds")
        
        if exc_type is not None:
            print(f"Exception occurred: {exc_val}")
        return False  # Don't suppress exceptions

class DatabaseConnection:
    """Context manager for database connections."""
    
    def __init__(self, db_name):
        self.db_name = db_name
        self.connection = None
    
    def __enter__(self):
        print(f"Connecting to database: {self.db_name}")
        self.connection = sqlite3.connect(":memory:")  # In-memory database
        return self.connection
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.connection:
            if exc_type is None:
                self.connection.commit()
                print("Transaction committed")
            else:
                self.connection.rollback()
                print("Transaction rolled back due to error")
            
            self.connection.close()
            print("Database connection closed")

@contextlib.contextmanager
def temporary_file(filename, content):
    """Context manager using contextlib decorator."""
    import os
    
    # Setup
    try:
        with open(filename, 'w') as f:
            f.write(content)
        print(f"Temporary file '{filename}' created")
        
        yield filename  # This is what gets returned by 'as'
        
    finally:
        # Cleanup
        try:
            os.remove(filename)
            print(f"Temporary file '{filename}' removed")
        except OSError:
            print(f"Could not remove '{filename}'")

@contextlib.contextmanager
def suppress_stdout():
    """Context manager to suppress stdout."""
    import sys
    from io import StringIO
    
    old_stdout = sys.stdout
    sys.stdout = StringIO()
    try:
        yield
    finally:
        sys.stdout = old_stdout

# Using context managers
print("=== Timer Context Manager ===")
with Timer("Data processing"):
    # Simulate some work
    time.sleep(0.1)
    numbers = [i**2 for i in range(1000)]
    result = sum(numbers)

print(f"Result: {result}")

print("\\n=== Database Context Manager ===")
with DatabaseConnection("test.db") as conn:
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE users (id INTEGER, name TEXT)")
    cursor.execute("INSERT INTO users VALUES (1, 'Alice')")
    cursor.execute("INSERT INTO users VALUES (2, 'Bob')")
    
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    print(f"Users: {users}")

print("\\n=== Temporary File Context Manager ===")
with temporary_file("temp.txt", "This is temporary content") as filename:
    with open(filename, 'r') as f:
        content = f.read()
    print(f"File content: {content}")

print("\\n=== Multiple Context Managers ===")
with Timer("File operations"), temporary_file("multi.txt", "Multi-context test") as temp_file:
    with open(temp_file, 'r') as f:
        lines = f.readlines()
    print(f"Read {len(lines)} lines")

print("\\n=== Suppressing Output ===")
print("This will be printed")
with suppress_stdout():
    print("This will be suppressed")
    print("This too")
print("This will be printed again")

# Exception handling in context managers
print("\\n=== Exception Handling ===")
try:
    with Timer("Operation with error"):
        time.sleep(0.05)
        raise ValueError("Something went wrong!")
except ValueError as e:
    print(f"Caught exception: {e}")`,
    language: 'python',
    difficulty: 'advanced',
    concepts: ['context managers', '__enter__', '__exit__', 'contextlib', 'resource management']
  },
  {
    id: 'async-programming',
    title: 'Async Programming',
    description: 'Asynchronous programming with asyncio',
    code: `# Asynchronous programming
import asyncio
import aiohttp
import time
from typing import List

async def fetch_data(url: str, session: aiohttp.ClientSession) -> dict:
    """Fetch data from URL asynchronously."""
    try:
        async with session.get(url) as response:
            return {
                "url": url,
                "status": response.status,
                "size": len(await response.text())
            }
    except Exception as e:
        return {"url": url, "error": str(e)}

async def fetch_multiple_urls(urls: List[str]) -> List[dict]:
    """Fetch multiple URLs concurrently."""
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_data(url, session) for url in urls]
        results = await asyncio.gather(*tasks)
        return results

async def countdown(name: str, seconds: int):
    """Async countdown function."""
    for i in range(seconds, 0, -1):
        print(f"{name}: {i}")
        await asyncio.sleep(1)
    print(f"{name}: Done!")

async def producer(queue: asyncio.Queue, items: List[str]):
    """Producer that adds items to queue."""
    for item in items:
        await queue.put(item)
        print(f"Produced: {item}")
        await asyncio.sleep(0.1)
    
    # Signal completion
    await queue.put(None)

async def consumer(queue: asyncio.Queue, name: str):
    """Consumer that processes items from queue."""
    while True:
        item = await queue.get()
        if item is None:
            # Signal to stop
            await queue.put(None)  # Pass signal to other consumers
            break
        
        print(f"{name} consumed: {item}")
        await asyncio.sleep(0.2)  # Simulate processing time
        queue.task_done()

class AsyncContextManager:
    """Async context manager example."""
    
    async def __aenter__(self):
        print("Entering async context")
        await asyncio.sleep(0.1)
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        print("Exiting async context")
        await asyncio.sleep(0.1)

async def async_generator(n: int):
    """Async generator example."""
    for i in range(n):
        await asyncio.sleep(0.1)
        yield i**2

async def main():
    """Main async function demonstrating various concepts."""
    
    print("=== Concurrent Countdowns ===")
    # Run multiple countdowns concurrently
    await asyncio.gather(
        countdown("Timer 1", 3),
        countdown("Timer 2", 2),
        countdown("Timer 3", 4)
    )
    
    print("\\n=== Producer-Consumer Pattern ===")
    # Producer-consumer with queue
    queue = asyncio.Queue(maxsize=5)
    items = ["item1", "item2", "item3", "item4", "item5"]
    
    # Start producer and consumers
    producer_task = asyncio.create_task(producer(queue, items))
    consumer1_task = asyncio.create_task(consumer(queue, "Consumer1"))
    consumer2_task = asyncio.create_task(consumer(queue, "Consumer2"))
    
    # Wait for completion
    await asyncio.gather(producer_task, consumer1_task, consumer2_task)
    
    print("\\n=== Async Context Manager ===")
    async with AsyncContextManager():
        print("Inside async context")
        await asyncio.sleep(0.1)
    
    print("\\n=== Async Generator ===")
    async for value in async_generator(5):
        print(f"Generated: {value}")
    
    print("\\n=== HTTP Requests (Simulated) ===")
    # Note: This would require actual URLs and aiohttp installation
    # For demo purposes, we'll simulate the concept
    urls = [
        "https://httpbin.org/delay/1",
        "https://httpbin.org/delay/2",
        "https://httpbin.org/delay/1"
    ]
    
    print("Simulating concurrent HTTP requests...")
    start_time = time.time()
    
    # Simulate async HTTP requests
    async def simulate_request(url: str, delay: float) -> dict:
        await asyncio.sleep(delay)
        return {"url": url, "status": 200, "delay": delay}
    
    tasks = [
        simulate_request(urls[0], 1),
        simulate_request(urls[1], 2),
        simulate_request(urls[2], 1)
    ]
    
    results = await asyncio.gather(*tasks)
    end_time = time.time()
    
    print(f"Completed {len(results)} requests in {end_time - start_time:.2f} seconds")
    for result in results:
        print(f"  {result}")

# Async decorator example
def async_timer(func):
    """Decorator for timing async functions."""
    async def wrapper(*args, **kwargs):
        start = time.time()
        result = await func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

@async_timer
async def slow_operation():
    """Simulate a slow async operation."""
    await asyncio.sleep(1)
    return "Operation completed"

# Run the async program
if __name__ == "__main__":
    # Run main async function
    asyncio.run(main())
    
    # Test async decorator
    result = asyncio.run(slow_operation())
    print(f"Result: {result}")`,
    language: 'python',
    difficulty: 'advanced',
    concepts: ['asyncio', 'async/await', 'coroutines', 'async context managers', 'async generators', 'concurrency']
  },
  {
    id: 'data-analysis',
    title: 'Data Analysis Example',
    description: 'Data processing and analysis with built-in libraries',
    code: `# Data analysis example using built-in libraries
import json
import csv
import statistics
from collections import Counter, defaultdict
from datetime import datetime, timedelta

# Sample data
sales_data = [
    {"date": "2024-01-01", "product": "Laptop", "category": "Electronics", "price": 999.99, "quantity": 2},
    {"date": "2024-01-02", "product": "Mouse", "category": "Electronics", "price": 29.99, "quantity": 5},
    {"date": "2024-01-03", "product": "Book", "category": "Education", "price": 19.99, "quantity": 3},
    {"date": "2024-01-04", "product": "Laptop", "category": "Electronics", "price": 999.99, "quantity": 1},
    {"date": "2024-01-05", "product": "Desk", "category": "Furniture", "price": 299.99, "quantity": 2},
    {"date": "2024-01-06", "product": "Chair", "category": "Furniture", "price": 199.99, "quantity": 4},
    {"date": "2024-01-07", "product": "Book", "category": "Education", "price": 24.99, "quantity": 2},
]

class SalesAnalyzer:
    """Class for analyzing sales data."""
    
    def __init__(self, data):
        self.data = data
        self.processed_data = self._process_data()
    
    def _process_data(self):
        """Process raw data and add calculated fields."""
        processed = []
        for record in self.data:
            record_copy = record.copy()
            record_copy['total'] = record['price'] * record['quantity']
            record_copy['date_obj'] = datetime.strptime(record['date'], '%Y-%m-%d')
            processed.append(record_copy)
        return processed
    
    def total_revenue(self):
        """Calculate total revenue."""
        return sum(record['total'] for record in self.processed_data)
    
    def revenue_by_category(self):
        """Calculate revenue by category."""
        category_revenue = defaultdict(float)
        for record in self.processed_data:
            category_revenue[record['category']] += record['total']
        return dict(category_revenue)
    
    def top_products(self, n=5):
        """Get top N products by revenue."""
        product_revenue = defaultdict(float)
        for record in self.processed_data:
            product_revenue[record['product']] += record['total']
        
        return sorted(product_revenue.items(), key=lambda x: x[1], reverse=True)[:n]
    
    def sales_statistics(self):
        """Calculate various sales statistics."""
        totals = [record['total'] for record in self.processed_data]
        quantities = [record['quantity'] for record in self.processed_data]
        
        return {
            'total_transactions': len(self.processed_data),
            'average_transaction': statistics.mean(totals),
            'median_transaction': statistics.median(totals),
            'max_transaction': max(totals),
            'min_transaction': min(totals),
            'total_items_sold': sum(quantities),
            'average_items_per_transaction': statistics.mean(quantities)
        }
    
    def daily_sales(self):
        """Calculate daily sales totals."""
        daily_totals = defaultdict(float)
        for record in self.processed_data:
            date_str = record['date']
            daily_totals[date_str] += record['total']
        
        return dict(sorted(daily_totals.items()))
    
    def export_to_csv(self, filename):
        """Export processed data to CSV."""
        with open(filename, 'w', newline='') as csvfile:
            fieldnames = ['date', 'product', 'category', 'price', 'quantity', 'total']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            writer.writeheader()
            for record in self.processed_data:
                row = {k: v for k, v in record.items() if k in fieldnames}
                writer.writerow(row)
    
    def generate_report(self):
        """Generate a comprehensive sales report."""
        stats = self.sales_statistics()
        category_revenue = self.revenue_by_category()
        top_products = self.top_products(3)
        daily_sales = self.daily_sales()
        
        report = f"""
SALES ANALYSIS REPORT
{'='*50}

OVERVIEW:
- Total Revenue: \${self.total_revenue():,.2f}
- Total Transactions: {stats['total_transactions']}
- Total Items Sold: {stats['total_items_sold']}

TRANSACTION STATISTICS:
- Average Transaction: \${stats['average_transaction']:.2f}
- Median Transaction: \${stats['median_transaction']:.2f}
- Largest Transaction: \${stats['max_transaction']:.2f}
- Smallest Transaction: \${stats['min_transaction']:.2f}
- Average Items per Transaction: {stats['average_items_per_transaction']:.1f}

REVENUE BY CATEGORY:
"""
        for category, revenue in sorted(category_revenue.items(), key=lambda x: x[1], reverse=True):
            percentage = (revenue / self.total_revenue()) * 100
            report += f"- {category}: \${revenue:,.2f} ({percentage:.1f}%)\\n"
        
        report += "\\nTOP PRODUCTS:\\n"
        for i, (product, revenue) in enumerate(top_products, 1):
            report += f"{i}. {product}: \${revenue:,.2f}\\n"
        
        report += "\\nDAILY SALES:\\n"
        for date, total in daily_sales.items():
            report += f"- {date}: \${total:,.2f}\\n"
        
        return report

def analyze_text_data(text):
    """Analyze text data for word frequency and statistics."""
    words = text.lower().split()
    
    # Clean words (remove punctuation)
    cleaned_words = []
    for word in words:
        cleaned = ''.join(char for char in word if char.isalnum())
        if cleaned:
            cleaned_words.append(cleaned)
    
    word_count = Counter(cleaned_words)
    
    return {
        'total_words': len(cleaned_words),
        'unique_words': len(word_count),
        'most_common': word_count.most_common(5),
        'average_word_length': statistics.mean(len(word) for word in cleaned_words),
        'longest_word': max(cleaned_words, key=len) if cleaned_words else '',
        'shortest_word': min(cleaned_words, key=len) if cleaned_words else ''
    }

# Main analysis
def main():
    """Main function to run the analysis."""
    print("SALES DATA ANALYSIS")
    print("=" * 50)
    
    # Create analyzer
    analyzer = SalesAnalyzer(sales_data)
    
    # Generate and print report
    report = analyzer.generate_report()
    print(report)
    
    # Export to CSV
    analyzer.export_to_csv('sales_report.csv')
    print("\\nData exported to 'sales_report.csv'")
    
    # Text analysis example
    sample_text = """
    Python is a powerful programming language that is widely used for data analysis,
    web development, artificial intelligence, and scientific computing. Its simple
    syntax and extensive libraries make it an excellent choice for beginners and
    experts alike. Python's versatility and readability have made it one of the
    most popular programming languages in the world.
    """
    
    print("\\n\\nTEXT ANALYSIS")
    print("=" * 50)
    
    text_stats = analyze_text_data(sample_text)
    print(f"Total words: {text_stats['total_words']}")
    print(f"Unique words: {text_stats['unique_words']}")
    print(f"Average word length: {text_stats['average_word_length']:.1f}")
    print(f"Longest word: {text_stats['longest_word']}")
    print(f"Shortest word: {text_stats['shortest_word']}")
    print("\\nMost common words:")
    for word, count in text_stats['most_common']:
        print(f"  {word}: {count}")

if __name__ == "__main__":
    main()`,
    language: 'python',
    difficulty: 'intermediate',
    concepts: ['data analysis', 'statistics', 'collections', 'CSV', 'JSON', 'classes', 'file I/O']
  }
];

export function getRandomPythonSample(): CodeSample {
  const randomIndex = Math.floor(Math.random() * PYTHON_SAMPLES.length);
  return PYTHON_SAMPLES[randomIndex];
}