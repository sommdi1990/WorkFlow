#!/bin/bash

# Build script for WorkFlow project
# Sets Java version to 17 and performs Maven operations

echo "Setting Java version to 17..."
export JAVA_HOME=/home/soroush/.sdkman/candidates/java/17.0.12-graal
export PATH=$JAVA_HOME/bin:$PATH

# Verify Java version
echo "Java version:"
java -version

echo ""
echo "Starting Maven build process..."

# Clean previous builds
echo "Cleaning previous builds..."
mvn clean

# Compile the project
echo "Compiling the project..."
mvn compile

# Package the project
echo "Packaging the project..."
mvn package

echo ""
echo "Build completed successfully!"
echo "JAR file should be available in target/ directory"
