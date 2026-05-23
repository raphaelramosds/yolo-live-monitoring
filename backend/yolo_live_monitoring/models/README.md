# YOLO Live Monitoring models

Install dependencies

```bash
poetry install
```

Export model

```bash
yolo export model=yolo26n-seg.pt format=onnx opset=12 batch=1
```