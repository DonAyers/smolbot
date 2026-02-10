#!/usr/bin/env python3
"""
Simple SDXL image generator for pixel art game assets
"""
import sys
import json
from pathlib import Path
from diffusers import DiffusionPipeline
import torch

def generate_mech(request_file, output_path):
    """Generate pixel art mech using SDXL"""
    
    # Load request
    with open(request_file, 'r') as f:
        request = json.load(f)
    
    print(f"🎨 Generating: {request['name']}")
    print(f"   Description: {request['description']}")
    print(f"   Style: {request['gameStyle']}")
    
    # Build prompt with pixel art style
    prompt = f"""pixel art sprite, {request['description']}, 
    {request['gameStyle']} style, crisp clean pixels, 
    16-bit retro game graphics, side view, transparent background,
    sprite sheet ready, vibrant colors, high detail"""
    
    negative_prompt = """blurry, low quality, 3d render, realistic, 
    photograph, smooth gradients, anti-aliased"""
    
    print(f"\n📝 Prompt: {prompt[:100]}...")
    print(f"\n⏳ Loading SDXL model...")
    
    # Load model - use float32 for CPU compatibility
    pipe = DiffusionPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-base-1.0",
        torch_dtype=torch.float32,  # Use float32 for CPU
        use_safetensors=True,
        variant="fp16" if torch.cuda.is_available() else None
    )
    
    # Move to GPU if available
    if torch.cuda.is_available():
        pipe = pipe.to("cuda")
        print("   Using GPU acceleration")
    else:
        print("   Using CPU (this will be slow - may take 5-10 minutes)")
    
    print(f"\n🖼️  Generating image...")
    
    # Generate image - use fewer steps for faster generation
    print("   Starting generation (this may take several minutes on CPU)...")
    image = pipe(
        prompt=prompt,
        negative_prompt=negative_prompt,
        num_inference_steps=20,  # Reduced from 30 for faster generation
        guidance_scale=7.5,
        width=512,
        height=512
    ).images[0]
    
    # Save
    image.save(output_path)
    print(f"\n✅ Image saved to: {output_path}")
    
    return True

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python generate-with-sdxl.py <request-json> <output-path>")
        sys.exit(1)
    
    request_file = sys.argv[1]
    output_path = sys.argv[2]
    
    try:
        generate_mech(request_file, output_path)
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
