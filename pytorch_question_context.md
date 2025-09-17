# PyTorch Question Context & Metadata

## Core PyTorch Concepts for Quiz Questions

### Tensor Operations
- torch.tensor(), torch.zeros(), torch.ones(), torch.empty(), torch.arange(), torch.linspace()
- Tensor manipulation: reshape(), view(), squeeze(), unsqueeze(), transpose()
- Tensor indexing and slicing: basic, advanced, boolean indexing
- Device management: .to(device), .cuda(), .cpu()

### Autograd & Gradients
- torch.autograd: automatic differentiation
- requires_grad parameter and gradient computation
- backward() method and gradient accumulation
- torch.no_grad() context manager
- grad_fn and computational graph

### Neural Network Modules
- torch.nn.Module: base class for neural networks
- torch.nn.Linear, torch.nn.Conv2d, torch.nn.LSTM
- Activation functions: ReLU, Sigmoid, Tanh, Softmax
- Loss functions: CrossEntropyLoss, MSELoss, BCELoss
- Optimizers: SGD, Adam, RMSprop

### Training & Evaluation
- model.train() vs model.eval() modes
- Batch processing and DataLoader
- Learning rate scheduling
- Checkpointing and model saving/loading
- Gradient clipping and normalization

### Advanced Features
- Custom datasets and data loading
- Model parallelism and distributed training
- TorchScript for production deployment
- Mixed precision training
- Transfer learning and fine-tuning

### Performance & Memory
- CUDA operations and GPU utilization
- Memory management and optimization
- Vectorization and broadcasting
- In-place operations vs new tensor creation

## Question Difficulty Distribution Target
- Easy (15s): 10 questions - Basic tensor operations, simple concepts
- Medium (18-20s): 16 questions - Autograd, training concepts, neural network components
- Hard (25s): 6 questions - Advanced features, optimization, production concepts

## Topics to Cover in Expansion
1. Advanced tensor operations
2. Autograd mechanics and computational graphs
3. Neural network architecture components
4. Training loop components
5. Optimization algorithms
6. Loss functions and metrics
7. Data loading and preprocessing
8. Model deployment and production
9. Performance optimization
10. GPU/CUDA operations
11. Custom modules and functions
12. Debugging and profiling
13. Model serialization
14. Advanced training techniques
15. Transfer learning concepts
