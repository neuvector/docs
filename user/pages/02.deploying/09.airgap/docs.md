---
title: Air Gapping NeuVector
taxonomy:
    category: docs
---

### Tools Needed

We need to install three tools for downloading all the bits for Neuvector.

* [Helm](https://helm.sh/) - Application Lifecycle Manager
* [Skopeo](https://github.com/containers/skopeo) - Image/Registry Tool
* [ZStandard](https://github.com/facebook/zstd) - Compresstion Algorithm

```bash
# install helm
curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# install skopeo - rocky linux based
yum install zstd skopeo -y
```

### Get Images and Chart

In order to get all the images we are going to use the chart itself. Using [Helm](https://helm.sh/) let's add the repo and download the chart. We will also use [skopeo](https://github.com/containers/skopeo) for downloading and uploading.

```bash
# make a directory
mkdir -p neuvector/images

# add repo
helm repo add neuvector https://neuvector.github.io/neuvector-helm/

# update local chart
helm repo update

# pull
helm pull neuvector/core -d neuvector
```

You should now see a file like `core-2.4.0.tgz`. The version may vary, but this is correct. This is the downloaded chart. Now we need the images. Good thing we can use the chart to figure this out.

```bash
# create image list
helm template neuvector/core-*.tgz | awk '$1 ~ /image:/ {print $2}' | sed -e 's/\"//g' > neuvector/images/list.txt

# get images
for i in $(cat neuvector/images/list.txt); do 
  skopeo copy docker://$i docker-archive:neuvector/images/$(echo $i| awk -F/ '{print $3}'|sed 's/:/_/g').tar:$(echo $i| awk -F/ '{print $3}')
done
```

Fantastic, we should have a directory that looks like:

```bash
[root@flux ~]# ls -lR neuvector
neuvector:
total 16
-rw-r--r--. 1 root root 15892 Jan  8 14:33 core-2.4.0.tgz
drwxr-xr-x. 2 root root   153 Jan  8 14:35 images

neuvector/images:
total 953920
-rw-r--r--. 1 root root 236693504 Jan  8 14:35 controller_5.1.0.tar
-rw-r--r--. 1 root root 226704384 Jan  8 14:35 enforcer_5.1.0.tar
-rw-r--r--. 1 root root       176 Jan  8 14:34 list.txt
-rw-r--r--. 1 root root 331550208 Jan  8 14:35 manager_5.1.0.tar
-rw-r--r--. 1 root root 169589760 Jan  8 14:35 scanner_latest.tar
-rw-r--r--. 1 root root  12265472 Jan  8 14:35 updater_latest.tar
```

And we can compress and move everything.

### Compress and Move

Compressing is fairly simple. We will use `tar` with the ZST format for maximum compression.

```bash
# compress
tar -I zstd -vcf neuvector_airgap.zst neuvector
```

Now simply move the 400M `neuvector_airgap.zst` to your network.

### Uncompress and Load

All we need to do now is uncompress with a similar command. The following will output to director called `neuvector`.

```bash
tar -I zstd -vxf neuvector_airgap.zst
```

Loading the images into a registry is going to require an understanding of your internal network. For this doc let's use "registry.awesome.sauce" as the DNS name. Loading the images is fairly simple again with `skopeo`. Please make sure it is installed on the "inside" machine. You will probably need to authenticate with `skopeo login` for it to work.

```bash
# skopeo load
export REGISTRY=registry.awesome.sauce
for file in $(ls neuvector/images | grep -v txt ); do 
     skopeo copy docker-archive:neuvector/images/$file docker://$(echo $file | sed 's/.tar//g' | awk -F_ '{print "'$REGISTRY'/neuvector/"$1":"$2}')
done
```

With all the images loaded in a registry we can install with Helm.

### Deploy with Helm

Deploying with Helm is fairly straight forward. There are a few values that are needed to insure the images are pulling from the local registry. Here is a good example. You may need to tweak a few settings. Please follow the Helm best practices for `values.yaml`. Note the `imagePullSecrets` field. This is the secret for your cluster to authenticate to the registry.

```bash
# helm install example
# variables
export REGISTRY=registry.awesome.sauce  # registry URL
export NEU_URL=neuvector.awesome.sauce   # neuvector URL

# helm all the things -- read all the options being set
helm upgrade -i neuvector --namespace neuvector neuvector/core --create-namespace  --set imagePullSecrets=regsecret --set k3s.enabled=true --set k3s.runtimePath=/run/k3s/containerd/containerd.sock  --set manager.ingress.enabled=true --set controller.pvc.enabled=true --set controller.pvc.capacity=10Gi --set manager.svc.type=ClusterIP --set registry=$REGISTRY --set tag=5.1.0 --set controller.image.repository=neuvector/controller --set enforcer.image.repository=neuvector/enforcer --set manager.image.repository=neuvector/manager --set cve.updater.image.repository=neuvector/updater --set manager.ingress.host=$NEU_URL
```

