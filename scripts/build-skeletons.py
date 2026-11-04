import sys, json, math
D, out = sys.argv[1], sys.argv[2]
def read(path, keep_h=False):
    L = open(path).read().splitlines()
    na, nb = int(L[3][:3]), int(L[3][3:6])
    atoms = [[l[31:34].strip(), float(l[0:10]), float(l[10:20])] for l in L[4:4+na]]
    bonds = [(int(l[0:3])-1, int(l[3:6])-1, int(l[6:9])) for l in L[4+na:4+na+nb]]
    keep = [i for i, a in enumerate(atoms) if keep_h or a[0] != 'H']
    idx = {k: n for n, k in enumerate(keep)}
    return [atoms[i] for i in keep], [(idx[a], idx[b], o) for a, b, o in bonds if a in idx and b in idx]
def pca(atoms):
    cx = sum(a[1] for a in atoms)/len(atoms); cy = sum(a[2] for a in atoms)/len(atoms)
    sxx = sum((a[1]-cx)**2 for a in atoms); syy = sum((a[2]-cy)**2 for a in atoms); sxy = sum((a[1]-cx)*(a[2]-cy) for a in atoms)
    th = 0.5*math.atan2(2*sxy, sxx-syy)
    return [[a[0], (a[1]-cx)*math.cos(th)+(a[2]-cy)*math.sin(th), -(a[1]-cx)*math.sin(th)+(a[2]-cy)*math.cos(th)] for a in atoms]
def norm(atoms):
    xs=[a[1] for a in atoms]; ys=[a[2] for a in atoms]
    s=max(max(xs)-min(xs), max(ys)-min(ys)); mx=(max(xs)+min(xs))/2; my=(max(ys)+min(ys))/2
    return [[a[0], round(0.5+(a[1]-mx)/s, 4), round(0.5+(a[2]-my)/s, 4)] for a in atoms]
res = {}
a, b = read(f"{D}/creatine.2d.sdf"); res['creatine'] = {'atoms': norm(pca(a)), 'bonds': b}
# Every structure is PubChem's own 2D layout, only rotated to its long axis and scaled (never bent or edited).
a, b = read(f"{D}/coq10.2d.sdf"); res['coq10'] = {'atoms': norm(pca(a)), 'bonds': b}  # hydrogens omitted
a, b = read(f"{D}/atp.2d.sdf"); res['atp'] = {'atoms': norm(pca(a)), 'bonds': b}
a, b = read(f"{D}/phosphocreatine.2d.sdf"); res['phosphocreatine'] = {'atoms': norm(pca(a)), 'bonds': b}
a, b = read(f"{D}/creatine.2d.sdf", keep_h=True); res['creatine-h'] = {'atoms': norm(pca(a)), 'bonds': b}
# Curcumin, flat 2D layout with hydrogens (the familiar ball-and-stick shape)
a, b = read(f"{D}/curcumin.2d.sdf", keep_h=True); res['turmeric-complex'] = {'atoms': norm(pca(a)), 'bonds': b}
json.dump(res, open(out, 'w'))
print({k: (len(v['atoms']), len(v['bonds'])) for k, v in res.items()})
