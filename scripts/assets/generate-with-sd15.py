#!/usr/bin/env python3
"""
Fast SD 1.5 image generator for pixel art game assets
Much faster than SDXL, especially on CPU
"""
import sys
import json
from pathlib import Path
from diffusers import StableDiffusionPipeline
import torch

def generate_mech(request_file, output_path):
    """Generate pixel art mech using SD 1.5 (faster than SDXL)"""
    
    # Load request
    with open(request_file, 'r') as f:
        request = json.load(f)
    
    print(f"🎨 Generating: {request['name']}")
    print(f"   Description: {request['description']}")
    print(f"   Style: {request['gameStyle']}")
    
    # Build prompt with pixel art style
    prompt = f"""pixel art sprite, {request['description']}, 
    {request['gameStyle']} style, crisp clean pixels, 
    16-bit retro game graphics, side view, game sprite,
    vibrant colors, high detail pixel art"""
    
    negative_prompt = """blurry, low quality, 3d render, realistic, 
    photograph, smooth gradients, anti-aliased, watermark, text"""
    
    print(f"\n📝 Prompt: {prompt[:100]}...")
    print(f"\n⏳ Loading SD 1.5 model (much faster than SDXL)...")
    
    # Load SD 1.5 - smaller and faster
    pipe = StableDiffusionPipeline.from_pretrained(
        "runwayml/stable-diffusion-v1-5",
        torch_dtype=torch.float32,
        use_safetensors=True
    )
    
    # Move to GPU if available, otherwise CPU
    if torch.cuda.is_available():
        pipe = pipe.to("cuda")
        print("   Using GPU acceleration")
    else:
        print("   Using CPU (should take 1-3 minutes)")
    
    print(f"\n🖼️  Generating image...")
    
    # Generate image
    image = pipe(
        prompt=prompt,
        negative_prompt=negative_prompt,
        num_inference_steps=25,
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
        print("Usage: python generate-with-sd15.py <request-json> <output-path>")
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
