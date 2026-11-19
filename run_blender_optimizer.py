import bpy
import os
import sys

def optimize_character_glb(in_path, out_path, target_verts=35000):
    print(f"=== Optimizing {in_path} -> {out_path} ===")
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=in_path)
    
    mesh_objs = [o for o in bpy.data.objects if o.type == 'MESH']
    for obj in mesh_objs:
        num_v = len(obj.data.vertices)
        if num_v > target_verts:
            ratio = target_verts / num_v
            print(f"Decimating {obj.name}: {num_v} verts -> ratio {ratio:.4f}")
            mod = obj.modifiers.new(name='Decimate', type='DECIMATE')
            mod.ratio = ratio
            bpy.context.view_layer.objects.active = obj
            bpy.ops.object.modifier_apply(modifier='Decimate')
            print(f"Result: {len(obj.data.vertices)} verts")

    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=out_path,
        export_format='GLB',
        export_apply=False,
        export_materials='EXPORT',
        export_animations=True,
        export_skins=True
    )
    sz_mb = os.path.getsize(out_path) / 1024 / 1024
    print(f"Finished {out_path}: {sz_mb:.2f} MB")

def optimize_static_glb(in_path, out_path, target_verts=40000):
    print(f"=== Optimizing Static {in_path} -> {out_path} ===")
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=in_path)
    
    mesh_objs = [o for o in bpy.data.objects if o.type == 'MESH']
    for obj in mesh_objs:
        num_v = len(obj.data.vertices)
        if num_v > target_verts:
            ratio = target_verts / num_v
            print(f"Decimating {obj.name}: {num_v} verts -> ratio {ratio:.4f}")
            mod = obj.modifiers.new(name='Decimate', type='DECIMATE')
            mod.ratio = ratio
            bpy.context.view_layer.objects.active = obj
            bpy.ops.object.modifier_apply(modifier='Decimate')
            print(f"Result: {len(obj.data.vertices)} verts")

    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=out_path,
        export_format='GLB',
        export_apply=False,
        export_materials='EXPORT',
        export_animations=False,
        export_skins=False
    )
    sz_mb = os.path.getsize(out_path) / 1024 / 1024
    print(f"Finished {out_path}: {sz_mb:.2f} MB")

if __name__ == '__main__':
    # 1. civil_officer.glb (Image 1 Chibi character with rigged suit/animations)
    optimize_character_glb('models/backup_original/civil_officer.glb', 'models/civil_officer.glb', target_verts=35000)
    # 2. chibi_character.glb
    optimize_character_glb('models/backup_original/chibi_character.glb', 'models/chibi_character.glb', target_verts=35000)
    # 3. boogi.glb
    optimize_character_glb('models/backup_original/boogi.glb', 'models/boogi.glb', target_verts=25000)
    # 4. city_hall.glb
    optimize_static_glb('models/backup_original/city_hall.glb', 'models/city_hall.glb', target_verts=40000)
    print("ALL MODELS OPTIMIZATION COMPLETED SUCCESSFULLY!")
